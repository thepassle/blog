---
title: A cleaner node modules ecosystem
description: And how to fix it
updated: 2024-07-25
---

# A cleaner `node_modules` ecosystem

There are many jokes in the software development ecosystem about the size of `node_modules` and JavaScript dependencies in general, like for example dependencies like `is-even`, or `is-odd`, or packages adding a ton of dependencies to support ridiculously low versions of Node.js. Fortunately, there are many individuals who are working on improving this situation, but there are also individuals actively adding more and more unnecessary dependencies to popular projects that get millions of downloads, leading to bloated `node_modules` folders with tons of dependencies.

![Heaviest objects in the world ranked from lightest to heaviest starting with the sun a neutron star a black hole and finally node modules](https://imgur.com/E0zycbs.png)

A lot of people have spoken up about this recently, and this has caused a great initiative to form in the shape of the [e18e community](https://e18e.dev/), where a bunch of talented, like-minded people are actively working on creating a cleaner, healthier, and more performant ecosystem. I should also note that the e18e initiative is **not only** about countering package bloat, there's a lot of important work going on to improve runtime performance of packages as well, but in this blog I'll be mainly addressing the `node_modules` situation.

## How do we fix this situation the ecosystem is in?

It starts with awareness. I've always been a firm believer of speaking up about things that you disagree with, because it might resonate with others and actually lead to change. (Definitely) not always, but sometimes it does. 

Package bloat can be a very tricky thing to keep track of; you install a dependency and never think about it again. But what dependencies does your dependency have? Do you religiously review your `package-lock.json` on PRs? Do you inspect your JavaScript bundles to see if anything weird got bundled? For a large amount of people the answer is likely "no". A [smart guy](https://x.com/kettanaito) once pointed out to me, in a discussion about barrel files and the performance implications of using them, that:

> "Changes like this cannot really happen in a sustainable fashion unless there's tooling around them."

And I wholeheartedly agree with that. If we're to counter package bloat, we're gonna need tooling; nobody wants to do these things manually, we need automation.

Fortunately, there are many projects being worked on to achieve this. The list at [e18e - resources](https://e18e.dev/guide/resources.html) is a good overview of tools that you can use in your projects, but in this blog I'd like to discuss a couple I've personally been involved with and worked on.

## Module Replacements

[`es-tooling/module-replacements`](https://github.com/es-tooling/module-replacements) is a project that was started by [James Garbutt](https://x.com/43081j) who started up a lot of great work on the ecosystem cleanup. Module replacements provides several "manifests" that list modules, and leaner, lighter replacements for them; which can either be alternative packages with fewer dependencies, or API's that have now been built-in natively.

What's nice about having these manifests available as machine readable documents, is that we can use them for automation, like for example [`eslint-plugin-depend`](https://www.npmjs.com/package/eslint-plugin-depend). `eslint-plugin-depend` helps suggest alternatives to various dependencies based on `es-tooling/module-replacements`, so you can easily discover potentially problematic dependencies in your projects, and find more modern/lightweight solutions for them.

## Module Replacements Codemods

If we have these module replacements and alternatives for them available, we can even take things further and automatically replace them via codemods. 

For those of you who are unsure what codemods are, codemods are automatic transformations that run on your codebase programmatically. What that means is that you give a codemod some input source code, and it will output changed code, like for example cleanup of dependencies. For example, a codemod for `is-even` would result in:

Before:
```js
const isEven = require('is-even');

console.log(isEven(0));
```

After:
```js
console.log((0 % 2 === 0));
```

To achieve this, we created the repository [`es-tooling/module-replacements-codemods`](https://github.com/es-tooling/module-replacements-codemods), which aims to provide automatic codemods for the module listed in `es-tooling/module-replacements`, so we can automatically replace them. Implementing codemods _for all these packages_ is a herculean effort; there are simply so many of them, which is why I've been spamming Twitter hoping to find more like-minded people and contributors. 

Fortunately (and a huge shoutout to [codemod.studio](https://codemod.com/studio) here, which is an amazing tool to start building codemods — even if you've never built one before!), the bulk of them were mostly fairly straightforward to implement, and we got many, many great contributions from people to implement codemods. What's nice about this is that for some of those people, it was their first time implementing a codemod! Being able to create codemods is a super valuable skill to have as a developer, so it's been really nice to see people taking on the challenge, learning something new in the process, and contributing to a healthier ecosystem.

![list of 20 contributors who contributed to the project](https://imgur.com/FvQBKMs.png)

I also want to give a special shoutout to [Matvey](https://github.com/ronanru) here who implemented a _huge_ amount of codemods single handedly.

We've currently implemented over 90% of all codemods, with the following module replacements left to implement:

![A list of codemods left to be implemented](https://imgur.com/eIVDnUx.png)

If you're interested in helping out, you can find some instructions on how to get started [here](https://github.com/es-tooling/module-replacements-codemods?tab=readme-ov-file#contributing). If you've never built a codemod before, I challenge you to try it! Take a look at [codemod.studio](https://codemod.com/studio), and I'm sure you'll be up and running in no time. If you're unsure how to get started or get stuck, please feel free to shoot me a [DM](https://x.com/passle_), and we can take a look together.

## So what do we do with these codemods?

For me, the goal of creating these codemods was to simplify the replacement of these packages on a large scale; I want people to be able to run these codemods on their own projects, but also I want everyone to be able to create pull requests to _other_ projects that may be using these dependencies. If people notice any of their dependencies leading to bloated `node_modules`, I want to enable them to fork and clone that project, run the codemods, and create a PR, hopefully speeding up the ecosystem cleanup by a lot.

In the near future, we'll be looking into implementing a CLI to help with this, so we can easily run these codemods on our projects; I'll create a separate blogpost about that when that happens.

In conclusion, it's been really great to see the amount of awareness that's been created around these issues, and also to see the amount of people it has resonated with and spurred into action. But we're not there yet! There are still, many, many, _many_ projects that cause bloated `node_modules` folders. I hope this blog finds you, I hope you agree, and I hope you'll do something about it with the tools being created.
