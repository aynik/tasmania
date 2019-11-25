import { createReducer, States } from '.';

describe('createReducer', () => {
    it('calls the next state', async () => {
        const nextState = jest.fn();
        enum state {
            A = 'A',
            B = 'B',
        }
        enum transition {
            CALL = 'CALL',
        }
        const transitions = {
            [state.A]: {
                [transition.CALL]: state.B,
            },
            [state.B]: null,
        };
        const states: States<typeof transitions, void> = {
            [state.A]: async () => {
                return { type: transition.CALL };
            },
            [state.B]: nextState,
        };
        const reduce = createReducer(transitions, states);
        await reduce({ type: state.A });
        expect(nextState).toHaveBeenCalled();
    });

    it('calls the next state with payload', async () => {
        const endState = jest.fn();
        enum state {
            A = 'A',
            B = 'B',
            END = 'END',
        }
        enum transition {
            CALL = 'CALL',
        }
        const transitions = {
            [state.A]: {
                [transition.CALL]: state.B,
            },
            [state.B]: {
                [transition.CALL]: state.END,
            },
            [state.END]: null,
        };
        const states: States<typeof transitions, { ended: boolean }> = {
            [state.A]: async () => {
                return { type: transition.CALL };
            },
            [state.B]: async () => {
                return { type: transition.CALL, payload: { ended: true } };
            },
            [state.END]: endState,
        };
        const reduce = createReducer(transitions, states);
        await reduce({ type: state.A });
        expect(endState).toHaveBeenCalledWith({ ended: true });
    });
});
