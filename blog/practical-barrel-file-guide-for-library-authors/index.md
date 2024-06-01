---
title: Practical barrel file guide for library authors
description: What to do, what not to do
updated: 2024-06-01
---

# Practical barrel file guide for library authors

Over the past couple of months I've been working on a lot on tooling against barrel files. A barrel file is essentially just a big **index.js** file that re-exports everything else from the package. Which means that if you import only one thing from that barrel file, you end up loading everything in its module graph. This has lots of downsides, from slowing down runtime performance to slowing down bundler performance. You can find a good introduction on the topic [here](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/) or a deep dive of the effects of barrel files on a popular real world library [here](/blog/barrel-files-a-case-study).

In this post, I'll give some practical advice for library authors on how to deal with barrel files in your packages.

## Use automated tooling

First of all, automated tooling can help a lot here. For example, if you want to check if your project has been setup in a barrel-file-free way, you can use [barrel-begone](https://www.npmjs.com/package/barrel-begone):

```
npx barrel-begone
```

`barrel-begone` will analyze **your packages entrypoints**, and analyze your code and warn for various different things:

- The total amount of modules loaded by importing the entrypoint
- Whether a file is a barrel or not
- Whether export * is used, which leads to poor or no treeshaking
- Whether import * is used, which leads to poor or no treeshaking
- Whether an entrypoint leads to a barrel file somewhere down in your module graph


## Lint against barrel files

Additionally, you can use linters against barrel files, like for example [eslint-plugin-barrel-files](https://www.npmjs.com/package/eslint-plugin-barrel-files) if you're using ESLint. If you're using tools like `Oxlint` or `Biome`, these rules are already built-in. This eslint plugin warns you against authoring barrel files, but also warns against importing from other barrel files, and helps you avoid using barrel files all around. 

## Avoid authoring barrel files

For example, if you author the following file, the eslint plugin will give a warning:

```js
// The eslint rule will detect this file as being a barrel file, and warn against it
// It will also provide additional warnings, for example again using namespace re-exports:
export * from './foo.js'; // Error: Avoid namespace re-exports
export { foo, bar, baz } from './bar.js';
export * from './baz.js'; // Error: Avoid namespace re-exports
```

## Avoid importing from barrel files
It will also warn you if you, as a library author, are importing something from a barrel file. For example, maybe your library makes use of an external library:

```js
import { thing } from 'external-dep-thats-a-barrel-file';
```

This will give the following warning:

```
The imported module is a barrel file, which leads to importing a module graph of <number> modules
```

If you run into this, you can instead try to find a more specific entrypoint to import `thing` from. If the project has a package exports map, you can consult that to see if there's a more specific import for the thing you're trying to import. Here's an example:

```json
{
  "name": "external-dep-thats-a-barrel-file",
  "exports": {
    ".": "./barrel-file.js", // 🚨
    "./thing.js": "./lib/thing.js" // ✅
  }
}
```

In this case, we can optimize our module graph size by a lot by just importing form `"external-dep-thats-a-barrel-file/thing.js"` instead!

If a project does _not_ have a package exports map, that essentially means anything is fair game, and you can try to find the more specific import on the filesystem instead.

## Don't expose a barrel file as the entrypoint of your package

Avoid exposing a barrel file as the entrypoint of your package. Imagine we have a project with some utilities, called `"my-utils-lib"`. You might have authored an `index.js` file that looks like this:

```js
export * from './math.js';
export { debounce, throttle } from './timing.js';
export * from './analytics.js';
```

Now if I, as a consumer of your package, only import:

```js
import { debounce } from 'my-utils-lib';
```

I'm _still_ importing everything from the `index.js` file, and everything that comes with it down the line; maybe `analytics.js` makes use of a hefty analytics library that itself imports a bunch of modules. And all I wanted to do was use a `debounce`! Very wasteful.

## On treeshaking

> "But Pascal, wont everything else just get treeshaken by my bundler??"

First of all, you've incorrectly assumed that everybody uses a bundler for every step of their development or testing workflow. It could also be the case that your consumer is using your library from a CDN, where treeshaking doesn't apply. Additionally, some patterns treeshake poorly, or may not get treeshaken as you might expect them to; because of sideeffects. There may be things in your code that are seen as sideeffectul by bundlers, which will cause things to _not_ get treeshaken. Like for example, did you know that: 

```js
Math.random().toString().slice(1);
```

Is seen as sideeffectful and might mess with your treeshaking?

## Create granular entrypoints for your library

Instead, provide **granular entrypoints** for your library, with a sensible grouping of functionality. Given our `"my-utils-lib"` library:

```js
export * from './math.js';
export { debounce, throttle } from './timing.js';
export * from './analytics.js';
```

We can see that there are separate kinds of functionality exposed: some math-related helpers, some timing-related helpers, and analytics. In this case, we might create the following entrypoints:

- `my-utils-lib/math.js`
- `my-utils-lib/timing.js`
- `my-utils-lib/analytics.js`

Now, I, as a consumer of `"my-utils-lib"`, will have to update my import from:

```js
import { debounce } from 'my-utils-lib';
```

to:
```js
import { debounce } from 'my-utils-lib/timing.js';
```

Small effort, fully automatable via codemods, and big improvement all around!

## How do I add granular entrypoints?

If you're using package exports for your project, and your main entrypoint is a barrel file, it probably looks something like this:

```json
{
  "name": "my-utils-lib",
  "exports": {
    ".": "./index.js" // 🚨
  }
}
```

Instead, create entrypoints that look like:

```json
{
  "name": "my-utils-lib",
  "exports": {
    "./math.js": "./lib/math.js", // ✅
    "./timing.js": "./lib/timing.js", // ✅
    "./analytics.js": "./lib/analytics.js" // ✅
  }
}
```

## Alternative: Subpath exports

Alternatively, you can add subpath exports for your package, something like:

```json
{
  "name": "my-utils-lib",
  "exports": {
    "./lib/*": "./lib/*"
  }
}
```

This will make anything under `./lib/*` importable for consumers of your package.

## A real-life example

Lets [again](https://thepassle.netlify.app/blog/barrel-files-a-case-study) take a look at the `msw` library as a case study. `msw` exposes a barrel file as the main entrypoint, and it looks something like this:

> Note: I've omitted the type exports for brevity

```js
export { SetupApi } from './SetupApi'

/* Request handlers */
export { RequestHandler } from './handlers/RequestHandler'
export { http } from './http'
export { HttpHandler, HttpMethods } from './handlers/HttpHandler'
export { graphql } from './graphql'
export { GraphQLHandler } from './handlers/GraphQLHandler'

/* Utils */
export { matchRequestUrl } from './utils/matching/matchRequestUrl'
export * from './utils/handleRequest'
export { getResponse } from './getResponse'
export { cleanUrl } from './utils/url/cleanUrl'

export * from './HttpResponse'
export * from './delay'
export { bypass } from './bypass'
export { passthrough } from './passthrough'
```

If I'm a consumer of `msw`, I might use `msw` to mock api calls with the `http` function, or `graphql` function, or both. Let's imagine my project doesn't use GraphQL, so I'm only using the `http` function:

```js
import { http } from 'msw';
```

Just importing this `http` function, will import the entire barrel file, including all of the `graphql` project as well, which adds a hefty **123 modules** to our module graph!

> Note: `msw` has since my last blogpost on the case study also added granular entrypoints for `msw/core/http` and `msw/core/graphql`, but they still expose a barrel file as main entrypoint, which [most](https://github.com/search?q=import+%7B+http+%7D+from+%27msw%27&type=code) of its users actually use.

Instead of shipping this barrel file, we could **group** certain kinds of functionalities, like for example:

**http.js**:
```js
export { HttpHandler, http };
```

**graphql.js**:
```js
export { GraphQLHandler, graphql };
```

**builtins.js**:
```js
export { bypass, passthrough };
```

**utils.js**:
```js
export { cleanUrl, getResponse, matchRequestUrl };
```

That leaves us with a ratatouille of the following exports, that frankly I'm not sure what to name, so I'll just name those **todo.js** for now (I also think these are actually just types, but they weren't imported via a `type` import):
```js
export { HttpMethods, RequestHandler, SetupApi };
```

Our package exports could look something like:

```json
{
  "name": "msw",
  "exports": {
    "./http.js": "./http.js",
    "./graphql.js": "./graphql.js",
    "./builtins.js": "./builtins.js",
    "./utils.js": "./utils.js",
    "./TODO.js": "./TODO.js"
  }
}
```

Now, I, as a consumer of MSW, only have to update my import from:

```js
import { http } from 'msw';
```

to:

```js
import { http } from 'msw/http.js';
```

Very small change, and fully automatable via codemods, but results in a big improvement all around, and no longer imports all of the graphql parser when I'm not even using graphql in my project!

Now, ofcourse it could be that users are not _only_ importing the `http` function, but also other things from `'msw'`. In this case the user may have to add an additional import or two, but that seems hardly a problem. Additionally, the [evidence](https://github.com/search?q=import+%7B+http+%7D+from+%27msw%27&type=code) seems to suggest that _most_ people will mainly be importing `http` or `graphql` anyway. 

## Conclusion

Hopefully this blogpost provides some helpful examples and guidelines for avoiding barrel files in your project. Here's a list of some helpful links for you to explore to learn more:

- [barrel-begone](https://www.npmjs.com/package/barrel-begone)
- [eslint-plugin-barrel-files](https://www.npmjs.com/package/eslint-plugin-barrel-files)
- [oxlint no-barrel-file](https://oxc-project.github.io/docs/guide/usage/linter/rules.html#:~:text=oxc-,no%2Dbarrel%2Dfile,-oxc)
- [biome noBarrelFile](https://biomejs.dev/linter/rules/no-barrel-file/)
- [Barrel files a case study](/blog/barrel-files-a-case-study)
- [Speeding up the JavaScript ecosystem - The barrel file debacle](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/)