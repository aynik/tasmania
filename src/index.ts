export type Transitions<T, P> = {
    [K in keyof Partial<T>]: (
        payload: P,
    ) => {
        type: keyof T & T[K];
        payload: P;
    } | void;
};

export function createReducer<T, P>(transitions: Transitions<T, P>) {
    return function reduce({
        type: stateType,
        payload,
    }: {
        type: keyof T;
        payload: P;
    }): { type: keyof T; payload: P } | P | void {
        const nextTransition = transitions[stateType](payload);
        if (!nextTransition) {
            return payload;
        }
        return reduce(nextTransition);
    };
}
