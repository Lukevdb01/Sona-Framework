function render(vnode) {
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const dom = document.createElement(vnode.type);

  for (let [name, value] of Object.entries(vnode.props)) {
    if (name.startsWith("on") && typeof value === "function") {
      const event = name.toLowerCase().substring(2);
      dom.addEventListener(event, value);
    } else {
      dom.setAttribute(name, value);
    }
  }

  vnode.children.forEach(child => {
    dom.appendChild(render(child));
  });

  return dom;
}

function updateElement(parent, newVNode, oldVNode, index = 0) {
    const existingDom = parent.childNodes[index];

    if (!oldVNode) {
        parent.appendChild(render(newVNode));
        return;
    }

    if (!newVNode) {
        parent.removeChild(existingDom);
        return;
    }

    if (newVNode.type !== oldVNode.type) {
        parent.replaceChild(render(newVNode), existingDom);
        return;
    }

    if (newVNode.type === "TEXT_ELEMENT") {
        if (newVNode.props.nodeValue !== oldVNode.props.nodeValue) {
            existingDom.nodeValue = newVNode.props.nodeValue;
        }
        return;
    }

    updateProps(existingDom, newVNode.props, oldVNode.props);

    const maxLength = Math.max(
        newVNode.children.length,
        oldVNode.children.length
    );

    for (let i = 0; i < maxLength; i++) {
        updateElement(existingDom, newVNode.children[i], oldVNode.children[i], i);
    }
}

function updateProps(dom, newProps, oldProps) {
  if (!dom._listeners) dom._listeners = {};

  // Remove old props
  for (let name in oldProps) {
    if (!(name in newProps)) {
      if (name.startsWith("on")) {
        const event = name.toLowerCase().substring(2);
        dom.removeEventListener(event, dom._listeners[event]);
        delete dom._listeners[event];
      } else {
        dom.removeAttribute(name);
      }
    }
  }

  // Add or update new props
  for (let name in newProps) {
    if (newProps[name] !== oldProps[name]) {
      if (name.startsWith("on")) {
        const event = name.toLowerCase().substring(2);
        if (dom._listeners[event]) {
          dom.removeEventListener(event, dom._listeners[event]);
        }
        dom._listeners[event] = newProps[name];
        dom.addEventListener(event, newProps[name]);
      } else {
        dom.setAttribute(name, newProps[name]);
      }
    }
  }
}