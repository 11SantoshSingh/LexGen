function lexer(input) {
    const tokens = [];
    const tokenSpec = [
      ['WHITESPACE', /^\s+/],
      ['LET', /^let\b/],
      ['VAR', /^var\b/],
      ['CONST', /^const\b/],
      ['IDENTIFIER', /^[a-zA-Z_][a-zA-Z0-9_]*/],
      ['ASSIGN', /^=/],
      ['NUMBER', /^\d+/],
      ['PLUS', /^\+/],
      ['MINUS', /^-/],
      ['MULTIPLY', /^\*/],
      ['DIVIDE', /^\//],
      ['LPAREN', /^\(/],
      ['RPAREN', /^\)/],
      ['SEMICOLON', /^;/]
    ];
  
    let current = 0;
    while (current < input.length) {
      let matched = false;
      for (const [type, regex] of tokenSpec) {
        const match = regex.exec(input.slice(current));
        if (match) {
          matched = true;
          if (type !== 'WHITESPACE') {
            tokens.push({ type, value: match[0] });
          }
          current += match[0].length;
          break;
        }
      }
      if (!matched) throw new Error('Unexpected character: ' + input[current]);
    }
    return tokens;
  }
  