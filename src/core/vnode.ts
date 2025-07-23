function h(type, props, ...children) {
    return {
        type,
        props: props || {},
        children: children.flat().map(child =>
            typeof child === "object" ? child : createTextElement(child)
        )
    };
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: { nodeValue: text },
        children: []
    };
}