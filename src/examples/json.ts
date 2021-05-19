import { createReducer } from '..';

function getToken<T>(
  input: string,
  matcher: RegExp,
  tokens: { type: Token; value?: string }[],
  token: T,
  store = false,
) {
  let match;
  if ((match = input.match(matcher))) {
    return {
      type: token,
      data: {
        input: input.substring(match[0].length),
        tokens: [
          ...tokens,
          store ? { type: token, value: match[0] } : { type: token },
        ],
      },
    };
  }
}

function throwError(token: Token, input: string) {
  throw new Error(
    `Failed after token ${token} on input ${input.substring(0, 1)}`,
  );
}

enum Token {
  START = 'START',
  OPEN_BRACKET = 'OPEN_BRACKET',
  COMMA = 'COMMA',
  CLOSE_BRACKET = 'CLOSE_BRACKET',
  OPEN_BRACE = 'OPEN_BRACE',
  CLOSE_BRACE = 'CLOSE_BRACE',
  COLON = 'COLON',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  NULL = 'NULL',
}

const MATCH_OPEN_BRACKET = /^(\[)/;
const MATCH_OPEN_BRACE = /^(\{)/;
const MATCH_CLOSE_BRACKET = /^(\])/;
const MATCH_CLOSE_BRACE = /^(\})/;
const MATCH_COMMA = /^(,)/;
const MATCH_COLON = /^(:)/;
const MATCH_STRING = /^"([^\\"]|\\\\|\\")*"/;
const MATCH_NUMBER = /^(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/;
const MATCH_NULL = /^(null)/;

function run() {
  const reduceJson = createReducer<
    {
      [Token.START]:
        | Token.OPEN_BRACKET
        | Token.OPEN_BRACE
        | Token.STRING
        | Token.NUMBER
        | Token.NULL;
      [Token.OPEN_BRACKET]: Token;
      [Token.COMMA]: Exclude<Token, Token.COMMA>;
      [Token.OPEN_BRACE]: Token.CLOSE_BRACE | Token.STRING;
      [Token.NUMBER]: Token.CLOSE_BRACE | Token.CLOSE_BRACKET | Token.COMMA;
      [Token.NULL]: Token.CLOSE_BRACE | Token.CLOSE_BRACKET | Token.COMMA;
      [Token.CLOSE_BRACKET]:
        | Token.CLOSE_BRACE
        | Token.CLOSE_BRACKET
        | Token.COMMA;
      [Token.CLOSE_BRACE]:
        | Token.CLOSE_BRACE
        | Token.CLOSE_BRACKET
        | Token.COMMA;
      [Token.STRING]:
        | Token.CLOSE_BRACE
        | Token.CLOSE_BRACKET
        | Token.COMMA
        | Token.COLON;
      [Token.COLON]:
        | Token.OPEN_BRACE
        | Token.OPEN_BRACKET
        | Token.STRING
        | Token.NUMBER
        | Token.NULL;
    },
    { input: string; tokens: { type: Token; value?: string }[] }
  >({
    [Token.START]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_OPEN_BRACKET, tokens, Token.OPEN_BRACKET) ??
        getToken(input, MATCH_OPEN_BRACE, tokens, Token.OPEN_BRACE) ??
        getToken(input, MATCH_STRING, tokens, Token.STRING, true) ??
        getToken(input, MATCH_NUMBER, tokens, Token.NUMBER, true) ??
        getToken(input, MATCH_NULL, tokens, Token.NULL) ??
        throwError(Token.START, input)
      );
    },
    [Token.OPEN_BRACKET]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_OPEN_BRACKET, tokens, Token.OPEN_BRACKET) ??
        getToken(input, MATCH_OPEN_BRACE, tokens, Token.OPEN_BRACE) ??
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        getToken(input, MATCH_STRING, tokens, Token.STRING, true) ??
        getToken(input, MATCH_NUMBER, tokens, Token.NUMBER, true) ??
        getToken(input, MATCH_NULL, tokens, Token.NULL) ??
        throwError(Token.OPEN_BRACKET, input)
      );
    },
    [Token.COMMA]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_OPEN_BRACKET, tokens, Token.OPEN_BRACKET) ??
        getToken(input, MATCH_OPEN_BRACE, tokens, Token.OPEN_BRACE) ??
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_STRING, tokens, Token.STRING, true) ??
        getToken(input, MATCH_NUMBER, tokens, Token.NUMBER, true) ??
        getToken(input, MATCH_NULL, tokens, Token.NULL) ??
        throwError(Token.COMMA, input)
      );
    },
    [Token.CLOSE_BRACKET]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        throwError(Token.CLOSE_BRACKET, input)
      );
    },
    [Token.OPEN_BRACE]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_STRING, tokens, Token.STRING, true) ??
        throwError(Token.OPEN_BRACE, input)
      );
    },
    [Token.CLOSE_BRACE]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        throwError(Token.CLOSE_BRACE, input)
      );
    },
    [Token.STRING]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        getToken(input, MATCH_COLON, tokens, Token.COLON) ??
        throwError(Token.STRING, input)
      );
    },
    [Token.NUMBER]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        throwError(Token.NUMBER, input)
      );
    },
    [Token.NULL]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_CLOSE_BRACKET, tokens, Token.CLOSE_BRACKET) ??
        getToken(input, MATCH_CLOSE_BRACE, tokens, Token.CLOSE_BRACE) ??
        getToken(input, MATCH_COMMA, tokens, Token.COMMA) ??
        throwError(Token.NULL, input)
      );
    },
    [Token.COLON]: ({ input, tokens }) => {
      input = input.trim();
      if (!input.length) {
        return;
      }
      return (
        getToken(input, MATCH_OPEN_BRACKET, tokens, Token.OPEN_BRACKET) ??
        getToken(input, MATCH_OPEN_BRACE, tokens, Token.OPEN_BRACE) ??
        getToken(input, MATCH_STRING, tokens, Token.STRING, true) ??
        getToken(input, MATCH_NUMBER, tokens, Token.NUMBER, true) ??
        getToken(input, MATCH_NULL, tokens, Token.NULL) ??
        throwError(Token.COLON, input)
      );
    },
  });
  console.log(
    reduceJson({
      type: Token.START,
      data: {
        input: '[{"a":"b", "c": {}}, ["d", "e", []], "f", 6, null]',
        tokens: [],
      },
    }),
  );
}

run();
