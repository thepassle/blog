---
title: Self unregistering service workers
description: Pong
updated: 2024-03-26
---

# Self unregistering Service Workers

## The Problem

At work, we use microfrontends for our frontend features. These features get deployed to a CDN, and the url for those features look something like this:

```
https://cdn.ing.com/ing-web/2.44.0/es-modules/button.js
```

The way this works is that features have full autonomy of their project and their dependencies when they are deployed. Imports to dependencies in a features source code get rewritten to a versioned URL of the dependency. Consider the following example:

```
feature-a@1.0.0
├─ ing-web@2.44.0
├─ ing-lib-ow@4.0.0
```

**Feature-a** is the feature teams project, and it has two dependencies: `ing-web@2.44.0` and **`ing-lib-ow@4.0.0`**. At buildtime, the imports for those dependencies will get rewritten so that they'll get loaded from:

```
https://cdn.ing.com/ing-web/2.44.0/es-modules/index.js
https://cdn.ing.com/ing-lib-ow/4.0.0/es-modules/index.js
```

This is nice, because **feature-a** is totally in control of their project and dependencies. However, this leads to a problem when features come together in apps. If we have many different features, **feature-a**, **feature-b**, **feature-c**, and they all depend on a different version of ing-web:

```
feature-a@1.0.0
├─ ing-web@2.40.0
├─ ing-lib-ow@4.0.0
 
feature-b@1.0.0
├─ ing-web@2.41.0
 
feature-c@1.0.0
├─ ing-web@2.41.1
```

The problem here is that the user visiting the app will download ing-web three times: version 2.40.0, version 2.41.0 and version 2.41.1. You can probably see why this is an issue; This is terrible for performance.

## A potential solution

To combat this, I was tinkering with a service worker that simply rewrites the URL whenever a request is done to the CDN. Given the following request:

```
https://cdn.ing.com/ing-web/2.41.0/es-modules/button.js
```

It will get rewritten to:

```
https://cdn.ing.com/ing-web/2.44.0/es-modules/button.js
```

Given that we use semver, we can expect there not to be breaking changes in the entrypoints of those projects. This does however mean that teams lose a bit of autonomy, as common, shared dependencies (like the design system) will now get deduped on the application level, and the application dictates which version of the design system is supported. I think this is a fair trade-off to make, given the performance implications.

The service worker I implemented only does one thing;
- If a CDN request comes in
  - If that request is for one of the packages we want to dedupe
  - Rewrite the request url to the version dictated by the app

Pretty straightforward. Here's some code:

```js
const packages = {
  'ing-web': {
    '2': '2.44.0',
  },
};

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.host.includes('cdn.ing.com')) {
    const [pkg, requestedVersion, _, file] = url.pathname.split('/').filter(Boolean);
    const [requestedMajor] = requestedVersion.split('.');

    for (const [packageName, versions] of Object.entries(packages)) {
      if (packageName === pkg) {
        for (const [major, rewriteTo] of Object.entries(versions)) {
          if (major === requestedMajor && requestedVersion !== rewriteTo) {
            url.pathname = url.pathname.replace(requestedVersion, rewriteTo);
            return event.respondWith(fetch(url));
          }
        }
      }
    }
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

```

And in the `index.html` of our app, we register the service worker:
```html
<script>
  navigator.serviceWorker.register('./sw.js');
</script>
```

## So what are you getting at?

So far so good. So what's actually the problem here? Well, my colleague [Kristjan Oddsson](https://twitter.com/koddsson) mentioned this thing to me once:

> It's always good to have an exit strategy for any code or library that you add

And so I was considering the impact of the service worker. I've used service workers quite a bit and I'd say I'm fairly well-versed with them, but in a large production application it can be a bit scary. What if something goes wrong? What if the service worker is buggy? If we ever want to get rid of the service worker, **what is our exit strategy**?

Doing some homework (googling and asking chatgpt), quickly leads to people recommending to just deploy a noop service worker, something like:

```js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.matchAll({
    type: 'window'
  }).then(windowClients => {
    windowClients.forEach((windowClient) => {
      windowClient.navigate(windowClient.url);
    });
  });
});
```

Another way of doing this, is just by calling the unregister method:
```html
<script>
  navigator.serviceWorker.unregister();
</script>
```

These options work well for the following scenario:

![happy scenario](https://i.imgur.com/8M0yXCf.jpeg)

In this scenario, version 1.0.0 of the app deploys with a `navigator.serviceWorker.register('./sw.js')` call. The user visits version 1.0.0 of the app, so the service worker gets installed. Then in version 2.0.0 of the app, the service worker is removed via `navigator.serviceWorker.unregister()`. The user visits the app again when the app is on version 2.2.0, which contains the unregistration of the service worker, and so the user no longer has the service worker; the service worker is removed successfully.

However, consider the following scenario:

![unhappy scenario](https://i.imgur.com/eRxQpOy.jpeg)

In this scenario, the user visits version 1.1.0 of the app, which contains the service worker registration; the service worker gets installed. In version 2.0.0 the app removes the service worker registration, and starts calling `unregister()`. The user does not visit the app during this time. Then in version 3.0.0, the call to `navigator.serviceWorker.unregister()` is removed from the code. The user only visits the app again on version 3.1.0, which no longer has the unregister call in the code, meaning that the user will still have the service worker they got installed on version 1.1.0; the service worker is not removed successfully.

So the question here is: when can you ever get rid of that code? When can you ever be sure that all your users have the noop service worker installed? And... then what happens to the noop service worker? Do they just have that installed forever? One way to achieve this is by basing it on analytics, but I wondered if there wasn't a different way of achieving this. For example, what if the service worker _itself_ would have some kind of keepalive check built-in? 

Here's the gist of it:
- On every `fetch` request, the service worker sends a debounced message to the `index.html`; a keepalive check
  - If the `index.html` responds to that message, the service worker will stay alive
  - If the `index.html` does _not_ respond to that message, the service worker will unregister itself

Here's an example:
```html
<script>
  navigator.serviceWorker?.register("./sw.js").catch(console.error);
  navigator.serviceWorker?.addEventListener("message", (event) => {
    console.log("[Client]: Pong sent.");
    event.ports[0].postMessage('pong');
  });
</script>
```

```js
function checkPong(pong, interval = 500, maxInterval = 4000) {
  setTimeout(() => {
    if (!pong()) {
      if (interval < maxInterval) {
        console.log('[Deduping SW]: Pong not received. Checking again in', interval * 2, 'ms.');
        checkPong(pong, interval * 2);
      } else {
        console.log('[Deduping SW]: Unregistering.');
        self.registration.unregister();
      }
    } else {
      console.log('[Deduping SW]: Pong received.');
    }
  }, interval);
}

async function _keepaliveCheck(clientId) {
  const channel = new MessageChannel();
  let pong = false;

  channel.port1.onmessage = event => {
    if (event.data === 'pong') {
      pong = true;
    }
  };

  const client = await clients.get(clientId);
  if (client) {
    client.postMessage('ping', [channel.port2]);
    console.log('[Deduping SW]: Ping.');
  
    checkPong(() => pong);
  }
}

const keepaliveCheck = debounce(_keepaliveCheck, 2000);

self.addEventListener('fetch', event => {
  keepaliveCheck(event.clientId);
  // other SW-ey code
});
```

This way, if we ever want to get rid of the service worker, we can just remove the following code from our `index.html`:

```html
<script>
  navigator.serviceWorker?.register("./sw.js").catch(console.error);
  navigator.serviceWorker?.addEventListener("message", (event) => {
    console.log("[Client]: Pong sent.");
    event.ports[0].postMessage('pong');
  });
</script>
```

Then, on the next keepalive check from the service worker, it will no longer get an answer from the `index.html`, and unregister itself; effectively ensuring that eventually every service worker will get unregistered, and we don't have any lingering code in our codebase because someone might still have a service worker installed.

Is this crazy? Maybe! Let me know on [twitter](https://twitter.com/passle_) or [mastodon](https://mastodon.social/@passle), because I'd love to hear some other thoughts about this!