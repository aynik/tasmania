import { createReducer } from '..'

enum State {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAS = 'GAS',
  ETHEREAL = 'ETHEREAL',
}

function run() {
  const reduceMatter = createReducer<
    {
      [State.SOLID]: Exclude<State, State.SOLID>
      [State.LIQUID]: Exclude<State, State.LIQUID>
      [State.GAS]: Exclude<State, State.GAS>
      [State.ETHEREAL]: null // Halts here
    },
    State[]
  >({
    [State.SOLID]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        }
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          data: [...data, State.LIQUID],
        }
      }
      return {
        type: State.GAS,
        data: [...data, State.GAS],
      }
    },
    [State.LIQUID]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        }
      }
      if (Math.random() > 0.5) {
        return {
          type: State.GAS,
          data: [...data, State.GAS],
        }
      }
      return {
        type: State.SOLID,
        data: [...data, State.SOLID],
      }
    },
    [State.GAS]: (data) => {
      if (Math.random() > 0.95) {
        return {
          type: State.ETHEREAL,
          data: [...data, State.ETHEREAL],
        }
      }
      if (Math.random() > 0.5) {
        return {
          type: State.LIQUID,
          data: [...data, State.LIQUID],
        }
      }
      return {
        type: State.SOLID,
        data: [...data, State.SOLID],
      }
    },
    [State.ETHEREAL]: () => {
      return
    },
  })
  console.log(
    reduceMatter({
      type: Object.values(State)[
        Math.floor(Math.random() * (Object.keys(State).length - 1))
      ],
      data: [],
    }),
  )
}

run()
