
import type { VNode } from './models/vnode.js';
import { Patch } from './patch.js';
import { render } from './renderer.js';

export function diff(currentVDOM: VNode | null, newVDOM: VNode): Patch[] {
    return [
        async (root: HTMLElement) => {
            if (!root || !(root instanceof HTMLElement)) {
                throw new Error('Invalid root element passed to diff patch function.');
            }
            // Remove all children
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            // Render new VDOM using the renderer
            const node = render(newVDOM);
            if (node) root.appendChild(node);
        }
    ];
}