import { createReducer } from '.'

describe('createReducer', () => {
  it('calls the next state', async () => {
    const endState = jest.fn()
    enum state {
      A = 'A',
      B = 'B',
      END = 'END',
    }
    const reduce = createReducer<
      {
        [state.A]: state.B
        [state.B]: state.END
        [state.END]: null
      },
      { ended: boolean }
    >({
      [state.A]: () => {
        return { type: state.B, data: { ended: false } }
      },
      [state.B]: () => {
        return { type: state.END, data: { ended: true } }
      },
      [state.END]: endState,
    })
    reduce({ type: state.A, data: { ended: false } })
    expect(endState).toHaveBeenCalledWith({ ended: true })
  })
})
