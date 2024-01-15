---
title: I overengineered my blog
description: I almost titled this "My blog is better than yours"
updated: 2024-01-14
---

# I overengineered my blog

> Alright, so at the time of writing, its not _entirely_ finished. I didn't setup the rss feed yet, I need to do some reworking for the OG stuff, but I can't be bothered to do that right now, as well as some other small things that need doing.

> You can find the source code [here](https://github.com/thepassle/blog)

I've been interested in Service Worker templating for a while now, largely inspired by [Jeff Posnick](https://jeffy.info/)'s work. Last year, I explored **[SWSR](/definitions#swsr)** and created a library called **[SWTL](https://github.com/thepassle/swtl)**, which this blog is built with.

**SWTL** is a Service Worker Templating Language for component-like templating in service workers. With it, you can stream templates to the browser as they're being parsed, and it can be used on the client side (in a, well, service worker), in Node(/Bun/Deno) processes, as well as other serverless, edge, or otherwise worker-like environments. You can read more about **SWTL** [here](/blog/service-worker-templating-language-(swtl)/).

I strongly believe that when you build a library or tool, you have to eat your own dogfood and actually build some projects with it yourself. I've used **SWTL** for a couple of small projects, as well as an internal project at work, and I've been wanting to build a personal blog for a while now as opposed to hosting all my content on [dev.to](https://dev.to/thepassle) only, so it seemed as good a time as any.

## How does it work

This blog uses isomorphic rendering; on initial request the blog will be served by a Netlify function. Once the page is loaded, the service worker will be installed, and once activated will take care of all other requests. The code that runs on the Netlify function is the same source code that runs in the service worker.

Here's a simplified example:

```js
import { html, Router } from 'swtl';
import { Html } from './src/Html.js';

export const router = new Router({
  routes: [
    {
      path: '/',
      render: ({url, params, query, request}) => { 
        const overview = fetch(url.origin + '/output/overview.html');

        return html`
          <${Html} title="Home">
            <h2>Overview</h2>
            ${overview}
          <//>
        `
      }
    },
  ]
});
```

## The content

My blog content is written using markdown files. I have a node script that turns those markdown files into HTML, and takes care of some other things like highlighting code snippets, and creating an overview of blogs/thoughts.

Those markdown files are eventually output as static HTML files, which I can then `fetch` in my templates inside the Netlify function/service worker:

```js
{
  path: '/blog/:title',
  render: ({url, params, query, request}) => {
    const blog = fetch(url.origin + '/output/blog/' + params.title + '/index.html');

    return html`
      <${Html} title="${title(params.title)}">
        <article class="post">
          ${blog}
        </article>
      <//>
    `
  }
},
```

Very annoyingly, most of the time I spent working on my blog was spent on the `md-to-html.js` script. For rendering my pages, I only have one dependency; **SWTL**. But for preprocessing my markdown files and turning them into HTML, I needed a bunch of dependencies, which I'm not a huge fan of.

Once I had the script setup, working with it was fairly straightforward. I'm already a big fan of [Astro](https://astro.build/), but writing all this md-to-html logic myself definitely has given me a new appreciation for it. _But_ blogs are to be overengineered, so here we are.

What's also kind of cool, if not a bit overkill, is that not only am I using **SWTL** on the server and in the service worker, but also in the `md-to-html.js` script itself.

```js
writeFileSync('./public/output/overview.html', await renderToString(html`<ul>${overview}</ul>`));
```

## Future work

As mentioned, there are a bunch of things to be improved yet, like handling OG information, the RSS feed, and some other small things, but at this point I just want to put something out there and share what I have. Is a blog ever really finished anyway?

There are also some other fun things to explore, like caching of the blogs. Currently they are preprocessed HTML pages that are `fetch`ed on demand, but since we're operating in a service worker, I should probably make use of caching. Since **SWTL** supports out-of-order streaming, one of the things I played around with is the following:

```js
{
  path: '/blog/:title',
  render: ({url, params}) => {
    const blog = fetch(url.origin + '/output/' + params.title + '/index.html');

    const cachedPromise = ENV === 'worker'
      ? caches.open('blogs').then(cache => blog.then(response => cache.put(url, response.clone())))
      : Promise.resolve();

    return html`
      <${Html}>
        <article>${blog}</article>

        ${ENV === 'worker' ? html`
          <${Await} promise=${() => cachePromise}>
            ${({pending, error, succes}) => html`
              ${when(pending, () => html`<p>Caching this blog...</p>`)}
              ${when(error, () => html`<p>Failed to cache blog.</p>`)}
              ${when(success, () => html`<p>Blog cached for offline reading pleasure.</p>`)}
            `}
          <//>
        `}
      <//>
    `
  }
}
```

This is cool, because it'll show pending/error/success states on the page without using any client-side JS (other than the service worker itself, of course)

Anyways, lots more to build and explore with. If you're interested in seeing how this blog was set up, you can take a look at the repository [here](https://github.com/thepassle/blog).