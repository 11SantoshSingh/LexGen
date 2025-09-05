function drawTree(svgId, tree, annotate = false) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = '';
  const levelGap = 70;
  const nodeGap = 100;
  const radius = 22;

  function layout(node) {
    if (!node.children || node.children.length === 0) {
      return { width: nodeGap, children: [], node };
    }
    const childrenLayouts = node.children.map(layout);
    const width = childrenLayouts.reduce((sum, child) => sum + child.width, 0);
    return { width, children: childrenLayouts, node };
  }

  function render(nodeLayout, x, y, parent = null) {
    const thisX = x + nodeLayout.width / 2;
    const thisY = y;

    if (parent) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', parent.x);
      line.setAttribute('y1', parent.y);
      line.setAttribute('x2', thisX);
      line.setAttribute('y2', thisY);
      line.setAttribute('stroke', '#aaa');
      svg.appendChild(line);
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', thisX);
    circle.setAttribute('cy', thisY);
    circle.setAttribute('r', radius);
    circle.setAttribute('class', annotate ? 'annotated-node' : 'node');
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', thisX);
    text.setAttribute('y', thisY + 4);
    text.setAttribute('class', 'text');
    text.textContent = nodeLayout.node.label;
    svg.appendChild(text);

    let childX = x;
    for (const child of nodeLayout.children) {
      render(child, childX, y + levelGap, { x: thisX, y: thisY });
      childX += child.width;
    }
  }

  const treeLayout = layout(tree);
  const treeWidth = treeLayout.width + 100;
  svg.setAttribute("width", treeWidth);
  render(treeLayout, 0, 50);
}
