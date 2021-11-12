export type Transitions<T, D> = {
  [K in keyof Partial<T>]: (
    data: D,
  ) => {
    type: keyof T & T[K]
    data: D
  } | void
}

export type State<T, D> = {
  type: keyof T
  data: D
}

export function createReducer<T, D>(
  transitions: Transitions<T, D>,
): (state: State<T, D>) => State<T, D> | D | void {
  return function reduce({
    type,
    data,
  }: {
    type: keyof T
    data: D
  }):
    | {
        type: keyof T
        data: D
      }
    | D
    | void {
    const nextTransition = transitions[type](data)
    return nextTransition ? reduce(nextTransition) : data
  }
}
