export type States<T, P> = {
    [K in keyof T]: (
        payload?: P,
    ) => Promise<{
        type: keyof T[K];
        payload?: P;
    } | void>;
};

export function createReducer<T, P>(transitions: T, states: States<T, P>) {
    return async function reduce({
        type: stateType,
        payload,
    }: {
        type: keyof T;
        payload?: P;
    }): Promise<void> {
        const nextTransition = await states[stateType](payload);
        if (!nextTransition) {
            return;
        }
        const {
            type: transitionType,
            payload: nextPayload,
        }: {
            type: keyof T[keyof T];
            payload?: P;
        } = nextTransition;
        return reduce({
            type: (transitions[stateType][
                transitionType
            ] as unknown) as keyof T,
            payload: nextPayload,
        });
    };
}
