import { createReducer } from '..';

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
    [State.SOLID]: (payload) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          payload: [...payload, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          payload: [...payload, State.LIQUID],
        };
      }
      return {
        type: State.GAS,
        payload: [...payload, State.GAS],
      };
    },
    [State.LIQUID]: (payload) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          payload: [...payload, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.GAS,
          payload: [...payload, State.GAS],
        };
      }
      return {
        type: State.SOLID,
        payload: [...payload, State.SOLID],
      };
    },
    [State.GAS]: (payload) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          payload: [...payload, State.ETHEREAL],
        };
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          payload: [...payload, State.LIQUID],
        };
      }
      return {
        type: State.SOLID,
        payload: [...payload, State.SOLID],
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
      payload: [],
    }),
  );
}

run();
