function parser(tokens) {
  let current = 0;

  function walk() {
    const token = tokens[current];

    if (token.type === 'NUMBER' || token.type === 'IDENTIFIER') {
      current++;
      return { label: token.value };
    }

    if (['VAR', 'LET', 'CONST'].includes(token.type)) {
      const keyword = tokens[current++];
      const id = tokens[current++];
      const eq = tokens[current++];
      const expr = expression();
      const semi = tokens[current++];
      return {
        label: 'Declaration',
        children: [
          { label: keyword.value },
          { label: id.value },
          { label: '=' },
          expr,
          { label: ';' }
        ]
      };
    }

    throw new Error('Unknown token: ' + token.type);
  }

  function expression() {
    let left = term();
    while (tokens[current] && ['PLUS', 'MINUS'].includes(tokens[current].type)) {
      const op = tokens[current++];
      const right = term();
      left = { label: op.value, children: [left, right] };
    }
    return left;
  }

  function term() {
    let left = factor();
    while (tokens[current] && ['MULTIPLY', 'DIVIDE'].includes(tokens[current].type)) {
      const op = tokens[current++];
      const right = factor();
      left = { label: op.value, children: [left, right] };
    }
    return left;
  }

  function factor() {
    const token = tokens[current];
    if (token.type === 'LPAREN') {
      current++;
      const expr = expression();
      if (tokens[current].type !== 'RPAREN') throw new Error('Expected closing parenthesis');
      current++;
      return expr;
    }
    return walk();
  }

  const program = { label: 'Program', children: [] };
  while (current < tokens.length) {
    program.children.push(walk());
  }
  return program;
}
