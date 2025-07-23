import { VNode } from "./models/vnode.js";
import type { Patch } from "./patch.js";
import { render } from "./renderer.js";

class SyncronizationLayer {
    private currentVDOM: VNode | null = null;

    constructor(private mountPoint: HTMLElement) { }

    public async syncVDOM(newVDOM: VNode): Promise<void> {
        await this.fetchServerVDOM(newVDOM);
    }

    private async applyPatches(patches: Patch[]): Promise<void> {
        for (const patch of patches) {
            await patch(this.mountPoint);
        }
    }

    public async render(): Promise<void> {
        if (this.currentVDOM) {
            this.mountPoint.innerHTML = '';
            this.mountPoint.appendChild(render(this.currentVDOM));
        }
    }

    async fetchServerVDOM(newVDOM: VNode): Promise<void> {
        const response = await fetch(window.location.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vdom: newVDOM })
        });
        const data = await response.json();
        this.mountPoint.innerHTML = data.html;
        this.currentVDOM = newVDOM;
    }
}

export { SyncronizationLayer };
