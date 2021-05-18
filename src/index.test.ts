import { createReducer } from '.';

describe('createReducer', () => {
  it('calls the next state', async () => {
    const nextState = jest.fn();
    enum state {
      A = 'A',
      B = 'B',
    }
    const reduce = createReducer<
      {
        [state.A]: state.B;
        [state.B]: null;
      },
      null
    >({
      [state.A]: () => {
        return { type: state.B, payload: null };
      },
      [state.B]: nextState,
    });
    reduce({ type: state.A, payload: null });
    expect(nextState).toHaveBeenCalled();
  });

  it('calls the next state with payload', async () => {
    const endState = jest.fn();
    enum state {
      A = 'A',
      B = 'B',
      END = 'END',
    }
    const reduce = createReducer<
      {
        [state.A]: state.B;
        [state.B]: state.END;
        [state.END]: null;
      },
      { ended: boolean }
    >({
      [state.A]: () => {
        return { type: state.B, payload: { ended: false } };
      },
      [state.B]: () => {
        return { type: state.END, payload: { ended: true } };
      },
      [state.END]: endState,
    });
    reduce({ type: state.A, payload: { ended: false } });
    expect(endState).toHaveBeenCalledWith({ ended: true });
  });
});
