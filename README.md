# tasmania 

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/aynik/tasmania.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/aynik/tasmania.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/aynik/tasmania.svg)

A strongly typed state machine

## Usage

```typescript
import { createReducer } from 'tasmania';

enum State {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAS = 'GAS',
  ETHEREAL = 'ETHEREAL',
}

function run() {
  const reduce = createReducer<
    {
      [State.SOLID]: Exclude<State, State.SOLID>;
      [State.LIQUID]: Exclude<State, State.LIQUID>;
      [State.GAS]: Exclude<State, State.GAS>;
      [State.ETHEREAL]: null; // Halts here
    },
    State[]
  >({
    [State.SOLID]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          data: [...data, State.LIQUID],
        };
      }
      return {
        type: State.GAS,
        data: [...data, State.GAS],
      };
    },
    [State.LIQUID]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.GAS,
          data: [...data, State.GAS],
        };
      }
      return {
        type: State.SOLID,
        data: [...data, State.SOLID],
      };
    },
    [State.GAS]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          data: [...data, State.LIQUID],
        };
      }
      return {
        type: State.SOLID,
        data: [...data, State.SOLID],
      };
    },
    [State.ETHEREAL]: () => {
      return;
    },
  });
  console.log(
    reduce({
      type: Object.values(State)[
        Math.floor(Math.random() * (Object.keys(State).length - 1))
      ],
      data: [],
    }),
  );
}

run();
```
