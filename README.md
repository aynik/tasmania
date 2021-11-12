# tasmania

[![npm version](https://badge.fury.io/js/tasmania.svg)](https://badge.fury.io/js/tasmania)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/aynik/tasmania.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/aynik/tasmania.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/aynik/tasmania.svg)

A strongly typed state machine

---

* [Install](#install)
* [API](#api)
    - [createReducer(transitions: Transitions<T, D>)](#createreducert-dtransitions-transitionst-d-reducert-d)
    - [State<T, D>](#statet-d-type)
    - [Transitions<T, D>](#transitionst-d-type)
* [Usage](#usage)
    - [Setup](#setup)
    - [Simple state machine](#simple-state-machine)

---

## Install

```shell
yarn add tasmania
```

[Back to top ↑](#tasmania)

---

## API

`tasmania` exports the following members:

```typescript
import {
  createReducer,
  State,
  Transitions
} from 'tasmania';
```

[Back to top ↑](#tasmania)

---

### `createReducer<T, D>(transitions: Transitions<T, D>): Reducer<T, D>`

It's the single factory function for creating state reducers, it takes a single argument which defines the state transitions.

> `T` represents a Transitions definition and `D` may be any type of data carried over.

```typescript
createReducer<
  {
    A: 'B'
    B: 'END'
    END: null
  },
  { ended: boolean }
>({
  A: () => {
    return { type: 'B', data: { ended: false } }
  },
  B: () => {
    return { type: 'END', data: { ended: true } }
  },
  END: endState,
})
```

[Back to top ↑](#tasmania)

---

### `State<T, D>` (type)

A structure reprenseting the machine state, with the signature `{ type: keyof T, data: D }`. 

> `T` represents a Transitions definition and `D` may be any type of data carried over.

[Back to top ↑](#tasmania)

---

### `Transitions<T, D>` (type)

A structure representing the machine transitions definition, with the signature `{ [K: keyof T]: (data: D) => { type: keyof T, data: D } | void }`.

> `T` represents a Transitions definition and `D` may be any type of data carried over.

[Back to top ↑](#tasmania)

---

## Usage

Here's a throughout usage example.

[Back to top ↑](#tasmania)

---

### Setup

First we need to import the `createReducer` function from this library.

```typescript
import { createReducer } from 'tasmania';
```

[Back to top ↑](#tasmania)

---

### Simple state machine

Let's now create a simple but complete state machine that will track hypothetical matter state transitions.

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

[Back to top ↑](#tasmania)
