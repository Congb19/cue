import { CNode } from './cnode';
export const renderer = (cnode: CNode, container: HTMLElement) => {
  // do tag
  const el = document.createElement(cnode.tag);
  // do props
  for (const key in cnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase(), cnode.props[key]);
    }
  }
  // do children
  if (typeof cnode.children == 'string')
    el.appendChild(document.createTextNode(cnode.children));
  else if (Array.isArray(cnode.children))
    cnode.children.forEach((item) => renderer(item, el));
  
  // mount
  container.appendChild(el);
};
