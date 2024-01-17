---
title: On Bun
description: Compatibility and interoperability
updated: 2024-01-17
---
# On Bun

I recently had a discussion on Twitter about Bun, and I figured there's enough to talk about to warrant a post. Bun aims to be the [replacement](https://x.com/jarredsumner/status/1738435352883499278?s=20) of Node as the default runtime, and spends a lot of effort and resources at compatibility with Node; your Node code should work in Bun. The thing is that Bun's compatibility is a one-way street; Your Node code should work in Bun, but your Bun code may not work work in Node, because they provide lots of non-standard conveniences out of the box that may behave differently depending on the runtime/tool/bundler that you use.

Some of those non-standard conveniences include non-standard imports, like:
```js
import text from "./text.txt";
console.log(text);
// => "Hello world!"
```

Or a build-time concept called "Macros" that let you run JavaScript at build-time via [Import Attributes](https://github.com/tc39/proposal-import-attributes):
```js
import { random } from './random.ts' with { type: 'macro' };

console.log(`Your random number is ${random()}`);
```

> I have some thoughts about (ab)using import attributes for non-standard stuff as well, but thats a post for another day

As well as otherwise [adding non-standard functionality to standardized API's](https://x.com/jarredsumner/status/1620414853214277634?s=20) that may well have led to Smooshgate-like scenarios.

I find offering these kind of non-standardisms out of the box concerning for many different reasons, and I might even go as far to say that they're actively harmful to the rest of the JavaScript ecosystem. I've previously written about this in my blog called [The Cost of Convenience](/blog/the-cost-of-convenience).

## Standardization

Standardization is a slow process. It is sometimes too slow. A good example of this is JSON and CSS modules, which is a clear example of a want that developers have had for a _long_ time, and we're _still_ not quite there yet. The [Import Attributes](https://github.com/tc39/proposal-import-attributes) proposal is a great way forward for this, but has gone through some revisions (moving from `assert` to `with`), and generally has taken a really long time to get where we're at today. 

Because importing these things werent available natively historically, this has led many bundlers and other tooling to implement their own version of these kinds of imports (sometimes without opting in, but enabled by default), and sometimes these versions of these kinds of imports are incompatible across tools. Tool A may give you something different than tool B. This is why standardization is a _good thing_.

Bun on the other hand does not seem to care about standardization and interoperability; they only care about Bun. This may sounds harsh, but they've made this very clear. There's a very big difference between _interoperability_ and _compatibility_, and Bun's compatibility only goes one way. This is disappointing, especially considering that there are good avenues dedicated to interoperability, like the [WinterCG](https://wintercg.org/) (Web-**interoperable** Runtimes Community Group), which Bun is not a part of at the time of writing.

Additionally, it seems that a lot of Bun's decisions are based on convenience, and often on Twitter polls. Someone on Twitter even argued that "It's Node's task to keep up with Bun" (paraphrased) and this, to me, seems like an incredibly hostile way to go about standardization, where one runtime just ships anything based on Twitter vibes, and other runtimes are just expected to keep up. The JavaScript ecosystem is messy enough as it is; there is a reason that standardization takes time. 

## But what about

Other runtimes like Deno? I have similar concerns about Deno, which may warrant it's own post at some point, but here's the short of it: Deno supports type checking via TypeScript out of the box, but... which version? TypeScript doesn't follow semver (which surprisingly _a lot_ of people [don't seem to realize](https://x.com/robpalmer2/status/1727969814272966885?s=20)), and often does breaking changes on minor or patch versions. They have a good reason for this, but it does go against the grain of the rest of the ecosystem, and many developers [don't seem to realize](https://x.com/robpalmer2/status/1727969814272966885?s=20) that this is the case. This means that if TypeScript makes a breaking change, and Deno upgrades the version of TypeScript, your Deno code may be broken. Deno considers this ["a good thing"](https://docs.deno.com/runtime/manual/advanced/typescript/faqs#there-was-a-breaking-change-in-the-version-of-typescript-that-deno-uses-why-did-you-break-my-program).

Admittedly there is a lot of nuance to add to this, but as mentioned, that's for another day.

## The nuance

It's not surprising that tools or even runtimes experiment with non-standard things and try to push the ecosystem forward; this is _healthy_. If no innovation takes place at all, what is there to standardize? Developers want to be productive, and want better and easier ways to achieve their goals. And if anything; Bun is definitely trying to innovate and trying to move the needle. 

I just don't think the way they're going about it is the best way to do it.