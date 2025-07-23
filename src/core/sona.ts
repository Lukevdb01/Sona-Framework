import { VNode } from './models/vnode.js';
import { SyncronizationLayer } from './sync.js';
import { diff } from './diff.js';

class SonaClientApp {
    private syncLayer: SyncronizationLayer;

    constructor(private mountPoint: HTMLElement, patchEndpoint: string) {
        this.syncLayer = new SyncronizationLayer(mountPoint);
    }

    public async render(newVDOM: VNode): Promise<void> {
        await this.syncLayer.syncVDOM(newVDOM);
    }

    public async sync(newVDOM: VNode): Promise<void> {
        const patches = diff(newVDOM);
        for (const patchFn of patches) {
            await patchFn(this.mountPoint);
        }

        const serverPatch = await this.sendPatchToServer(newVDOM);
        if (serverPatch) {
            this.applyServerPatch(serverPatch);
        }
    }

    private async sendPatchToServer(newVDOM: VNode): Promise<any> {
        try {
            const response = await fetch(window.location.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vdom: newVDOM })
            });
            if (!response.ok) throw new Error('Server error');
            return await response.json();
        } catch (e) {
            console.error('Failed to sync with server:', e);
            return null;
        }
    }

    private applyServerPatch(patch: any): void {
        if (patch && patch.html) {
            this.mountPoint.innerHTML = patch.html;
            return;
        }

        if (patch && patch.patch) {
            const serverPatch = patch.patch;
            if (serverPatch.vdom) {
                const patches = diff(serverPatch.vdom);
                for (const patchFn of patches) {
                    patchFn(this.mountPoint);
                }
            } else if (serverPatch.op === 'update') {
                const patches = diff(serverPatch.vdom);
                for (const patchFn of patches) {
                    patchFn(this.mountPoint);
                }
            }
        } else if (patch && patch.vdom) {
            const patches = diff(patch.vdom);
            for (const patchFn of patches) {
                patchFn(this.mountPoint);
            }
        }
    }
}

export { SonaClientApp };