function semanticAnalyzer(tree) {
  const symbolTable = new Map();

  function annotate(node) {
    if (!node) return null;

    const newNode = { ...node };
    if (node.children) {
      newNode.children = node.children.map(annotate);
    }

    // Enhance semantic info for declarations
    if (node.label === 'Declaration') {
      const varName = node.children[1].label;
      const exprNode = node.children[3];

      const value = evaluate(exprNode);
      const expressionText = toInfix(exprNode);

      const previouslyDeclared = symbolTable.has(varName);
      symbolTable.set(varName, value);

      newNode.label = `Declares ${varName} = ${value}`;
      if (previouslyDeclared) {
        newNode.label += " (overwritten)";
      }
      newNode.label += ` [${expressionText}]`;
    }

    return newNode;
  }

  function evaluate(node) {
    if (!node) return 0;

    if (!node.children) {
      const value = Number(node.label);
      if (!isNaN(value)) return value;
      return symbolTable.get(node.label) ?? 0;
    }

    const [left, right] = node.children;
    switch (node.label) {
      case '+': return evaluate(left) + evaluate(right);
      case '-': return evaluate(left) - evaluate(right);
      case '*': return evaluate(left) * evaluate(right);
      case '/': return evaluate(right) !== 0 ? evaluate(left) / evaluate(right) : 0;
    }

    return 0;
  }

  function toInfix(node) {
    if (!node || !node.children) return node.label;
    const [left, right] = node.children;
    return `(${toInfix(left)} ${node.label} ${toInfix(right)})`;
  }

  return annotate(tree);
}
