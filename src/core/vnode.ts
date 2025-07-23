import type { VNode } from './models/vnode.js';

interface TextVNode extends VNode {
    type: "TEXT_ELEMENT";
    props: { nodeValue: string };
    children: [];
}

function h(type: string, props: { [key: string]: any } | null, ...children: (VNode | string)[]): VNode {
    return {
        type,
        props: props || {},
        children: children.flat().map(child =>
            typeof child === "object" ? child as VNode : createTextElement(child)
        )
    };
}

function createTextElement(text: string): TextVNode {
    return {
        type: "TEXT_ELEMENT",
        props: { nodeValue: text },
        children: []
    };
}