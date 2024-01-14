---
title: Events are the shit
description: You may not need to reach for a library — give native events a try
updated: 2023-07-26
---

# Events are the shit

Pardon my profanity, there's just no better way to say it. Events are just great. In this blog I'll showcase some cool things that you can achieve with just plain old events. You might not need an expensive or heavy library! Try an event.

## Use `EventTarget`

Did you know you can instantiate `EventTarget`s?

```js
const target = new EventTarget();

target.dispatchEvent(new Event('foo'));
target.addEventListener('foo', (event) => {});
```

## Extend `Event`!

Did you know you can extend `Event`? 

Instead of creating `CustomEvent`s, you can just extend the `Event` class, and assign data to it, or even implement other methods on it:

```js
// Create the event:
class MyEvent extends Event {
  constructor(data) {
    super('my-event', { bubbles: true, composed: true });
    this.data = data;
  }
}

const target = new EventTarget();

// Fire the event:
target.dispatchEvent(new MyEvent({foo: 'bar'}));

// Catch the event:
target.addEventListener('my-event', ({data}) => {
  console.log(data); // { foo: 'bar' }
});
```

## Extend `EventTarget`!

Did you know you can also _extend_ `EventTarget`?

Here's how you can create a super minimal state manager using events:

```js
class StateEvent extends Event {
  constructor(state = {}) {
    super('state-changed');
    this.state = state;
  }
}

export class State extends EventTarget {
  #state;
  
  constructor(initialState) {
    super();
    this.#state = initialState;
  }

  setState(state) {
    this.#state = typeof state === 'function' ? state(this.#state) : structuredClone(state);
    this.dispatchEvent(new StateEvent(this.#state));
  }

  getState() {
    return this.#state;
  }
}

export const state = new State({});
```

And then you can use it like:

```js
state.setState({foo: 'bar'}); // #state === {foo: 'bar'}
state.setState((old) => ({...old, bar: 'baz'})); // #state === {foo: 'bar', bar: 'baz'}

state.addEventListener('state-changed', ({state}) => {
  // Assign state, trigger a render, whatever
});

state.getState(); // {foo: 'bar', bar: 'baz'};
```

I use this in my [`@thepassle/app-tools`](https://github.com/thepassle/app-tools/blob/master/state/index.js) library, and it's often all the state management I need. Super tiny, but powerful state manager.

## Events are sync

Did you know events execute synchronously?

```js
const target = new EventTarget();

console.log('first');

target.addEventListener('foo', ({data}) => {
  console.log('second');
});

target.dispatchEvent(new Event('foo'));

console.log('third');
```

Outputs:
```
// first
// second
// third
```

## Context-like patterns

It's a common scenario to pass down properties to child components. However, sometimes you end up in a situation known as "prop drilling", where you need to get some property down to a deeply nested child component, and along the way you're passing the property through components that really don't need to know about the property in the first place. In this case, it can sometimes be easier for the child component to request the property from a parent higher up the tree. This is also known as the context pattern. Since events execute synchronously, we can just use the following pattern:

```js
class MyParent extends HTMLElement {
  theme = 'dark';

  constructor() {
    super();
    /**
     * The provider: 
     */
    this.addEventListener('theme-context', (event) => {
      event.theme = this.theme;
    });
  }
}

export class MyChild extends HTMLElement {
  connectedCallback() {
    const event = new Event('theme-context', {
      bubbles: true, 
      composed: true, 
    });
    this.dispatchEvent(event);

    /**
     * Because events execute synchronously, the callback for `'theme-context'`
     * event executes first, and assigns the `theme` to the `event`, which we
     * can then access in the child component
     */
    console.log(event.theme); // 'dark';
  } 
}
```

## Promise-carrying events

Did you know events can also carry promises? A great showcase of this pattern is the [`Pending Task Protocol`](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md) by the Web Components Community Group. Now, "Pending Task Protocol" sounds very fancy, but really, it's just an event that carries a promise.

Consider the following example, we create a new `PendingTaskEvent` class:

```js
class PendingTaskEvent extends Event {
  constructor(complete) {
    super('pending-task', {bubbles: true, composed: true});
    this.complete = complete;
  }
}
```

And then in a child component, whenever we do some asynchronous work, we can send a `new PendingTaskEvent` to signal to any parents that a task is pending:

```js
class ChildElement extends HTMLElement {
  async doWork() { /* ... */ }

  startWork() {
    const workComplete = this.doWork();
    this.dispatchEvent(new PendingTaskEvent(workComplete));
  }
}
```

In our parent component we can then catch the event, and show/hide a loading state:

```js
class ParentElement extends HTMLElement {
  #pendingTaskCount = 0;

  constructor() {
    super();
    this.addEventListener('pending-task', async (e) => {
      e.stopPropagation();
      if (++this.#pendingTaskCount === 1) {
        this.showSpinner();
      }
      await e.complete;
      if (--this.#pendingTaskCount === 0) {
        this.hideSpinner();
      }
    });
  }
}
```