---
title: Service Worker Templating Language (SWTL)
description: Component-like templating in service workers, or other worker-like environments
updated: 2023-08-19
---

# Service Worker Templating Language (SWTL)

> Check out the starter project [here](https://github.com/thepassle/swtl-starter).

I've previously written about Service Worker Side Rendering (**SWSR**) in this [blog](https://dev.to/thepassle/service-worker-side-rendering-swsr-cb1), when I was exploring running [Astro](https://github.com/withastro/astro) in a Service Worker.

I recently had a usecase for a small app at work and I just kind of defaulted to a SPA. At some point I realized I needed a Service Worker for my app, and I figured, why not have the entire app rendered by the Service Worker? All I need to do was fetch some data, some light interactivity that I don't need a library or framework for, and stitch some html partials together based on that data. If I did that in a Service Worker, I could stream in the html as well.

While I was able to achieve this fairly easily, the developer experience of manually stitching strings together wasnt great. Being myself a fan of buildless libraries, such as [htm](https://github.com/developit/htm) and [lit-html](https://github.com/lit/lit), I figured I'd try to take a stab at implementing a DSL for component-like templating in Service Workers myself, called [Service Worker Templating Language](https://github.com/thepassle/swtl) (**SWTL**), here's what it looks like:

```js
import { html, Router } from 'swtl';
import { BreadCrumbs } from './BreadCrumbs.js'

function HtmlPage({children, title}) {
  return html`<html><head><title>${title}</title></head><body>${children}</body></html>`;
}

function Footer() {
  return html`<footer>Copyright</footer>`;
}

const router = new Router({
  routes: [
    {
      path: '/',
      render: ({params, query, request}) => html`
        <${HtmlPage} title="Home">
          <h1>Home</h1>
          <nav>
            <${BreadCrumbs} path=${request.url.pathname}/>
          </nav>
          ${fetch('./some-partial.html')}
          ${caches.match('./another-partial.html')}
          <ul>
            ${['foo', 'bar', 'baz'].map(i => html`<li>${i}</li>`)}
          </ul>
          <${Footer}/>
        <//>
      `
    },
  ]
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(router.handleRequest(event.request));
  }
});
```

## `html`

To create this DSL, I'm using Tagged Template Literals. For those of you who are not familiar with them, here's what they look like:

```js
function html(statics, ...dynamics) {
  console.log(statics);
  console.log(dynamics);
}

html`hello ${1} world`;

// ["hello ", " world"];
// [1]
```

A Tagged Template Literal gets passed an array of static values (string), and an array of dynamic values (expressions). Based on those strings and expressions, I can parse the result and add support for reusable components.

I figured that since I'm doing this in a Service Worker, I'm only creating html responses and not doing any kind of diffing, I should be able to just return a stitched-together array of values, and components. Based on `preact/htm`'s component syntax, I built something like this:

```js
function Foo() {
  return html`<h2>foo</h2>`;
}

const world = 'world';

const template = html`<h1>Hello ${world}</h1><${Foo}/>`;

// ['<h1>Hello ', 'world', '</h1>', { fn: Foo, children: [], properties: []}]
```

I can then create a `render` function to serialize the results and stream the html to the browser:

```js
/**
 * `render` is also a generator function that takes care of stringifying values
 * and actually calling the component functions so their html gets rendered too
 */
const iterator = render(html`hello ${1} world`);
const encoder = new TextEncoder();

const stream = new ReadableStream({
  async pull(controller) {
    const { value, done } = await iterator.next();
    if (done) {
      controller.close();
    } else {
      controller.enqueue(encoder.encode(value));
    }
  }
});

/**
 * Will stream the response to the browser as results are coming
 * in from our iterable
 */
new Response(stream);
```

However, I then realized that since I'm streaming the html anyways, instead of waiting for a template to be parsed entirely and return an array, why not stream the templates _as they are being parsed_? Consider the following example:

```js
function* html(statics, ...dynamics) {
  for(let i = 0; i < statics.length; i++) {
    yield statics[i];
    if (dynamics[i]) {
      yield dynamics[i];
    }
  }
}
```

Using a generator function, we can yield results as we encounter them, and stream those results to the browser immediately. We can then iterate over the template results:

```js
const template = html`hello ${1} world`;

for (const chunk of template) {
  console.log(chunk);
}

// "hello "
// 1
// " world"
```


What makes this even cooler is that we can provide first class support for other streamable things, like iterables:

```js
function* generator() {
  yield* html`<li>1</li>`;
  yield* html`<li>2</li>`;
}

html`<ul>${generator()}</ul>`;
```

Or other streams, or `Response`s:
```js
html`
  ${fetch('./some-html.html')}
  ${caches.match('./some-html.html')}
`;
```

### Why not do this at build time?

The following template:
```js
const template = html`<h1>hi</h1><${Foo} prop=${1}>bar<//>`
```

Would compile to something like:
```js
const template = ['<h1>hi</h1>', {fn: Foo, properties: [{name: 'prop', value: 1}], children: ['bar']}];
```

While admittedly that would save a little runtime overhead, it would increase the bundlesize of the service worker itself. Considering the fact that templates are streamed _while_ they are being parsed, I'm not convinced pre-compiling templates would actually result in a noticeable difference. 

Also I'm a big fan of [buildless development](https://dev.to/thepassle/the-cost-of-convenience-kco), and libraries like [lit-html](https://github.com/lit/lit) and [preact/htm](https://github.com/developit/htm), and the bundlesize for the `html` function itself is small enough:

![Minified code for the html function](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s0bvub78wvu99e2p27oi.png)

## Isomorphic rendering

While I'm using this library in a Service Worker only, similar to a SPA approach, you can also use this library for isomorphic rendering in worker-like environments, or even just on any node-like JS runtime, _and_ the browser! The following code will work in any kind of environment:

```js
function Foo() {
  return html`<h1>hi</h1>`;
}

const template = html`<main><${Foo}/></main>`;

const result = await renderToString(template);
// <main><h1>hi</h1></main>
```

Hurray for agnostic libraries!

## Router

I also implemented a simple router based on [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) so you can easily configure your apps routes:

```js
import { Router, html } from 'swtl';

const router = new Router({
  routes: [
    {
      path: '/',
      render: () => html`<${HtmlPage}><h1>Home</h1><//>`
    },
    {
      path: '/users/:id',
      render: ({params}) => html`<${HtmlPage}><h1>User: ${params.id}</h1><//>`
    },
    {
      path: '/foo',
      render: ({params, query, request}) => html`<${HtmlPage}><h1>${request.url.pathname}</h1><//>`
    },
  ]
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(router.handleRequest(event.request));
  }
});
```

## Out of order streaming

I also wanted to try and take a stab at out of order streaming, for cases where you may need to fetch some data. While you could do something like this:

```js
async function SomeComponent() {
  try {
    const data = await fetch('/api/foo').then(r => r.json());
    return html`
      <ul>
        ${data.map(user => html`
          <li>${user.name}</li>
        `)}
      </ul>
    `;
  } catch {
    return html`Failed to fetch data.`;
  }
}
```

This would make the api call blocking and stop streaming html until the api call resolves, and we can't really show a loading state. Instead, we ship a special `<${Await}/>` component that takes an asynchronous `promise` function to enable out of order streaming.

```js
import { Await, when, html } from 'swtl';

html`
  <${Await} promise=${() => fetch('/api/foo').then(r => r.json())}>
    ${({pending, error, success}, data, error) => html`
      <h2>Fetching data</h2>
      ${when(pending, () => html`<${Spinner}/>`)}
      ${when(error, () => html`Failed to fetch data.`)}
      ${when(success, () => html`
        <ul>
          ${data.map(user => html`
            <li>${user.name}</li>
          `)}
        </ul>
      `)}
    `}
  <//>
`;
```

When an `Await` component is encountered, it kicks off the `promise` that is provided to it, and immediately stream/render the `pending` state, and continues streaming the rest of the document. When the rest of the document is has finished streaming to the browser, we await all the promises in order of resolution (the promise that resolves first gets handled first), and replace the `pending` result with either the `error` or `success` template, based on the result of the `promise`.

So considering the following code:

```js
html`
  <${HtmlPage}>
    <h1>home</h1>
    <ul>
      <li>
        <${Await} promise=${() => new Promise(r => setTimeout(() => r({foo:'foo'}), 3000))}>
          ${({pending, error, success}, data) => html`
            ${when(pending, () => html`[PENDING] slow`)}
            ${when(error, () => html`[ERROR] slow`)}
            ${when(success, () => html`[RESOLVED] slow`)}
          `}
        <//>
      </li>
      <li>
        <${Await} promise=${() => new Promise(r => setTimeout(() => r({bar:'bar'}), 1500))}>
          ${({pending, error, success}, data) => html`
            ${when(pending, () => html`[PENDING] fast`)}
            ${when(error, () => html`[ERROR] fast`)}
            ${when(success, () => html`[RESOLVED] fast`)}
          `}
        <//>
      </li>
    </ul>
    <h2>footer</h2>
  <//>
`;
```

This is the result:

![loading states are rendered first, while continuing streaming the rest of the document. Once the promises resolve, the content is updated in-place with the success state](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xdynf41uqwfymb4b0rki.gif)

We can see that the entire document is streamed, initially displaying loading states. Then, once the promises resolve, the content is updated in-place to display the success state.

## Wrapping up

I've published an initial version of [`swtl`](https://github.com/thepassle/swtl) to NPM, and so far it seems to hold up pretty well for my app, but please let me know if you run into any bugs or issues! Lets make it better together 🙂

You can also check out the starter project [here](https://github.com/thepassle/swtl-starter).

## Acknowledgements

- [lit-html](https://github.com/lit/lit)
- [preact/htm](https://github.com/developit/htm)
- [Astro](https://github.com/withastro/astro) and [Matthew Philips](https://twitter.com/matthewcp) - For doing the hard work of implementing the rendering logic back when I [requested](https://github.com/withastro/astro/pull/4832) this in astro
- [Artem Zakharchenko](https://twitter.com/kettanaito) - For helping with the handling of first-resolve-first-serve promises
- [Alvar Lagerlöf](https://twitter.com/alvarlagerlof) - For a cool demo of out of order streaming which largely influenced my implementation

And it's also good to mention that, while working/tweeting about some of the work in progress updates of this project, it seems like many other people had similar ideas and even similar implementations as well! It's always cool to see different people converging on the same idea 🙂
