---
title: Barrel files a case study
description: Untangling MSW
updated: 2024-01-30
---

# Barrel files - a case study

> Let me preface this blogpost with 2 things:
>
> **1:** This blogs intention is not to shame MSW, I'm a maintainer of MSW myself and it's a great project that has to consider lots of different usecases and environments, which is not always easy to do. The reason I'm highlighting MSW in this blog is because I encountered all this while working on it, and so it makes for a good illustrative case study of sorts.
>
> **2:** This is also not an "all barrel files are evil" kind of blog; consider your project, _how_ people may consume it, and apply some critical thinking. Although I will say that I personally find, more often than not, barrel files (and most notably some barrel-file related practices) to be a code smell. This blog is also not a criticism against anyone, it's just me going down a rabbit hole and taking you along for the ride

A couple of weeks ago I was working on one of our features, and I noticed that an enormous amount of JavaScript files were getting loaded in the browser during local development.

I set out to investigate, and noticed that out of 184 requests on the page, 179 were caused by `MSW`. For our local development environment, and also for running our unit tests, we don't bundle; we use buildless development, and we get a lot of benefits from this approach.

Now, it may be easy to jump to: "Just use a bundler", but there are many usecases and environments where its not common to use a bundler, like for example:

- When loading the library from a CDN
- During local development
- Test runners 
  - in the browser
  - in node processes 
- In JavaScript server-side runtime environments

These are all scenarios and examples of cases where we typically don't (or can't) bundle code, and we don't benefit from treeshaking. Additionally, `MSW` is a (mostly? only?) dev-time library, that we import and consume in our unit test code, not our source code directly; we also don't typically bundle our _unit test code_ before running our unit tests.

Additionally, barrel files also cause bundlers to slow down, and barrel files also often contain code like `export * from` or `import * as foo`, which bundlers often can't treeshake correctly.

## Untangling MSW's module graph

Knowing a little bit about `MSW`'s internals, and what it does, it felt like 179 modules being loaded was _way_ too much for what it does, so I started looking at what kind of modules are actually being loaded. I noticed pretty quickly that `GraphQL` is a large source of the requests being made, which struck me as curious, because while `MSW` does support mocking `GraphQL` requests, my project doesn't. So why am I still loading all this `GraphQL` related code that's going unused, and slows my development down?

Thankfully, the browser's network tab has a nifty initiator tab that shows you the import chain for a given import:

![initiator](https://i.imgur.com/xmfLY6P.png)

Starting at the root of the import chain, I pretty quickly discovered the culprit:

![barrel-file](https://i.imgur.com/AE6TWPI.png)

`MSW` ships as a _barrel file_. A barrel file is essentially just an `index` file that re-exports everything else from the package. Which means that if you import _only one thing_ from that barrel file, you end up loaded _everything_ in its module graph.

So even though in my code I'm only importing:
```js
import { http } from 'msw';
import { setupWorker } from 'msw/browser';
```
I still end up loading all the other modules, and the entire module graph, which itself may also contain _other_ barrel files, like for example `GraphQL`:

![graphql-barrel](https://i.imgur.com/fbiYG7W.png)

## Automating it

I brought this up in `MSW`'s maintainer channel on their Discord, and had a good discussion about it, and opened an issue on the MSW github repository. The creator of `MSW` and I also had a private chat on Discord and discussed how it would be nice to have some tooling around this, to make it easier for package authors and create more awareness around what their module graph may look like, and highlight some potential issues.

So I set out to coding, and created [`barrel-begone`](https://www.npmjs.com/package/barrel-begone) and [`eslint-plugin-barrel-files`](https://www.npmjs.com/package/eslint-plugin-barrel-files) which is a little eslint plugin that helps detect some barrel file-related issues during development. 

The `barrel-begone` package does a couple things:

It scans your packages entrypoints, either via the `"module"`, `"main"` or `"exports"` field in your `package.json`, and then it analyzes your module graph to detect the amount of modules that will be loaded in total by importing this entrypoint, and it also does some analysis on the modules that will be imported by this entrypoint, for example:

- Detecting barrel files
- Detecting `import *` style imports
- Detecting `export *` style exports

And pointing them out. Here's what that looks like on the `MSW` project:

![barrel-begone-1](https://i.imgur.com/xAYirY2.png)

From this information, we see that importing from module specifier `'msw'` causes a total of **179 modules** to be loaded, which is pretty much in line with what I noticed earlier on. We also see some other information like:

- The entrypoint itself is a barrel file
- The entrypoint uses some `export *` style exports
- The entrypoint leads to other modules that import from a barrel file

There's a lot to unpack, but since `GraphQL` makes up such a significant portion of all modules loaded, I figured I'd hunt that one down first. I found that there's actually only _one_ import for `'graphql'`, so I changed that import from:

```js
import { parse } from 'graphql';
```

To:

```js
import { parse } from 'graphql/language/parser.mjs';
```

And ran `npx barrel-begone` again:

![74-modules](https://i.imgur.com/6aUCSH6.png)

We're down from **179 modules** to **74 modules**. That seems like a pretty significant change already!

> I didn't think I'd have to spell this out, but Twitter proved otherwise; loading less modules in the browser is _better_ and more _performant_, and _speeds up_ local development. The less you load, the less the browser has to do.

However, we're still importing `GraphQL`'s parser while we don't even use it. So lets take another step, and create some separate entrypoints. Looking at the `'msw'` barrel file, there's a lot of stuff in there, but it seems reasonable to have separate entrypoints for (likely) the two most commonly imported things: the `http` and `graphql` handlers, so we'll be able to import them like:

```js
import { http } from 'msw/http';
```

Splitting up the entrypoints like this reduces the amount of modules loaded by a lot, because we're no longer importing anything from `GraphQL` which goes unused; the `msw/http` entrypoint leads to a module graph of **32 modules**. However, we're also importing the `msw/browser` entrypoint (because you can't use the one without the other), which itself leads to a module graph of **21 modules**, so in total, we're down from **179 modules** to **53 modules**.

Next up, `barrel-begone` told me there were a couple of other imports to another barrel file, namely in `@mswjs/interceptors`, lets see what that looks like:

![interceptors](https://i.imgur.com/QbYhEL0.png)

Yep, looks like another barrel file, with only one locally declared function. And it turns out that that in the `msw/http` entrypoint, that one function is the only thing that we need from the `@mswjs/interceptors` package. If we were to remove that from the barrel file as well, that brings us down from **32 modules** to **24 modules**, in total:

Down from **179 modules** to **45 modules**. That's a pretty significant difference! I didn't run any objective benchmarks, but on my personal macbook this improved the performance of the page load by **67%**. If you're interested in more numbers, I encourage you to take a look at some of your own projects and setups, finding the barrel files in your projects and/or libraries that you use with `barrel-begone` (or other tools), and see how much benefit you get from removing them.

## Conclusion

The github discussion on barrel files is still on-going, and there are some pull requests, but not everything in this blogpost has been implemented yet; all of this was done locally. Some things, like changing the `GraphQL` import may be tricky to do, because `MSW` uses a dual CJS/ESM setup. Hopefully, we can still make a lot of the changes highlighted in this blogpost in the near future though.

Despite that, I really wanted to make this blogpost to highlight a couple of things. Firstly, when authoring a package it's importing to consider how people _consume_ your package. As mentioned before, this is not always easy (like in the case of `MSW`'s dual CJS/ESM setup), but as a package author you should be conscious of this. _Where_ does your package get used? Does it make sense to ship only a barrel file? Or should you create some more granular, grouped entrypoints?

Secondly, a lot of the changes highlighted in this blogpost are not rocket science. Many of them were changing one import to another, or simply creating an additional entrypoint. Hopefully the `barrel-begone` tool will prove useful for other people as well to take a look at their entrypoints and give insight in _what_ they are actually shipping to their users.

And finally, I think this is important because _not_ doing this means death by a thousand cuts. In this case study, I've looked _exclusively_ at `MSW`, and I've done all this testing with just an empty `index.html` that imports `MSW`, but in an actual project you might be loading additional libraries, like testing utilities/helpers and other things as well, do they also have barrel files? All of these things combined add up.
