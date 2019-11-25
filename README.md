# tasmania 

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/aynik/tasmania.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/aynik/tasmania.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/aynik/tasmania.svg)

A typed action-based state machine

## Usage

```typescript
import { States, createReducer } from 'tasmania';

enum state {
    SOLID = 'SOLID',
    LIQUID = 'LIQUID',
    GAS = 'GAS',
    ETHEREAL = 'ETHEREAL',
}

enum transition {
    MELT = 'MELT',
    SUBLIMATE = 'SUBLIMATE',
    VAPORIZE = 'VAPORIZE',
    FREEZE = 'FREEZE',
    CONDENSATE = 'CONDENSATE',
    DEPOSIT = 'DEPOSIT',
    VANISH = 'VANISH',
}

const transitions = {
    [state.SOLID]: {
        [transition.MELT]: state.LIQUID,
        [transition.SUBLIMATE]: state.GAS,
        [transition.VANISH]: state.ETHEREAL,
    },
    [state.LIQUID]: {
        [transition.VAPORIZE]: state.GAS,
        [transition.FREEZE]: state.SOLID,
        [transition.VANISH]: state.ETHEREAL,
    },
    [state.GAS]: {
        [transition.CONDENSATE]: state.LIQUID,
        [transition.DEPOSIT]: state.SOLID,
        [transition.VANISH]: state.ETHEREAL,
    },
    [state.ETHEREAL]: null, // The machine halts here
};

type Payload = {
    vanished?: boolean;
    melted?: boolean;
    sublimated?: boolean;
    vaporized?: boolean;
    freezed?: boolean;
    condensated?: boolean;
    deposited?: boolean;
};

const states: States<typeof transitions, Payload> = {
    [state.SOLID]: async (payload) => {
        if (Math.random() > 0.9) {
            return {
                type: transition.VANISH,
                payload: { ...payload, vanished: true },
            };
        }
        if (Math.random() > 0.5) {
            return {
                type: transition.MELT,
                payload: { ...payload, melted: true },
            };
        }
        return {
            type: transition.SUBLIMATE,
            payload: { ...payload, sublimated: true },
        };
    },
    [state.LIQUID]: async (payload) => {
        if (Math.random() > 0.9) {
            return {
                type: transition.VANISH,
                payload: { ...payload, vanished: true },
            };
        }
        if (Math.random() > 0.5) {
            return {
                type: transition.VAPORIZE,
                payload: { ...payload, vaporized: true },
            };
        }
        return {
            type: transition.FREEZE,
            payload: { ...payload, freezed: true },
        };
    },
    [state.GAS]: async (payload) => {
        if (Math.random() > 0.9) {
            return {
                type: transition.VANISH,
                payload: { ...payload, vanished: true },
            };
        }
        if (Math.random() > 0.5) {
            return {
                type: transition.CONDENSATE,
                payload: { ...payload, condensated: true },
            };
        }
        return {
            type: transition.DEPOSIT,
            payload: { ...payload, deposited: true },
        };
    },
    [state.ETHEREAL]: async (payload) => {
        console.log('halted', payload);
        return;
    },
};

async function run() {
    const reduce = createReducer(transitions, states);
    await reduce({
        type: Object.values(state)[
            Math.floor(Math.random() * Object.keys(state).length)
        ],
        payload: {},
    });
}

run();
```
