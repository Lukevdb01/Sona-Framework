import { VNode } from './models/vnode.js';
import { SyncronizationLayer } from './sync.js';
import { diff } from './diff.js';

class SonaClientApp {
    private syncLayer: SyncronizationLayer;
    private clientVDOM: VNode | null = null;
    private serverVDOM: VNode | null = null;
    private patchEndpoint: string;

    constructor(private mountPoint: HTMLElement, patchEndpoint: string) {
        this.syncLayer = new SyncronizationLayer(mountPoint);
        this.patchEndpoint = patchEndpoint;
    }

    // Render new VDOM to DOM and update clientVDOM
    public async render(newVDOM: VNode): Promise<void> {
        this.clientVDOM = newVDOM;
        await this.syncLayer.syncVDOM(newVDOM);
    }

    // Main sync: send clientVDOM diff to server, receive patch, apply to clientVDOM and DOM
    public async sync(newVDOM: VNode): Promise<void> {
        // 1. Compute client-side patch and apply to DOM
        const patches = diff(this.clientVDOM, newVDOM);
        for (const patchFn of patches) {
            await patchFn(this.mountPoint);
        }
        // 2. Update clientVDOM
        this.clientVDOM = newVDOM;

        // 3. Send patch (or newVDOM for now) to server and receive server patch
        // (In a real implementation, send only the diff/patch, not the full VDOM)
        const serverPatch = await this.sendPatchToServer(newVDOM);
        // 4. Apply server patch to clientVDOM and DOM
        if (serverPatch) {
            this.applyServerPatch(serverPatch);
        }
    }

    // Send VDOM diff/patch to server and get server patch (fetch-based)
    private async sendPatchToServer(newVDOM: VNode): Promise<any> {
        try {
            const response = await fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vdom: newVDOM })
            });
            if (!response.ok) throw new Error('Server error');
            return await response.json(); // Expecting a patch or new VDOM
        } catch (e) {
            console.error('Failed to sync with server:', e);
            return null;
        }
    }

    // Apply patch from server to clientVDOM
    private applyServerPatch(patch: any): void {
        // Als er HTML is, direct vervangen (SSR fallback)
        if (patch && patch.html) {
            this.mountPoint.innerHTML = patch.html;
            return;
        }
        // Als er een patch is zonder HTML, pas deze toe op de clientVDOM en DOM
        if (patch && patch.patch) {
            const serverPatch = patch.patch;
            // Als er een vdom is, altijd behandelen als volledige vervanging
            if (serverPatch.vdom) {
                this.clientVDOM = serverPatch.vdom;
                const patches = diff(null, serverPatch.vdom);
                for (const patchFn of patches) {
                    patchFn(this.mountPoint);
                }
            } else if (serverPatch.op === 'update') {
                // Voorbeeld: als je een granular patch hebt, zou je die hier toepassen
                // Voor nu: geen granular patching geïmplementeerd
            }
        } else if (patch && patch.vdom) {
            this.clientVDOM = patch.vdom;
        }
    }
}

export { SonaClientApp };