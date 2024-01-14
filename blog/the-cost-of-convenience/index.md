---
title: The cost of convenience
description: Developer conveniences and long term maintainability
updated: 2023-05-04
---

# The cost of convenience

Something I see happen time and time again in frontend development is developers reaching for _conveniences_. It may be the hot new tool in town, it may be existing tooling, but developers just love to take shortcuts. And this is fine! We all love to spend our time being productive, right? We'll just add this one little convenience that will surely make our lives better, never think about it again and move on. 

## The conveniences

When we talk about _conveniences_, we generally talk about non-standardisms or any kind of magical behavior. A useful rule of thumb is to ask: "Does it run natively in a browser?". A good example of this are imports, which often get subjected to magical behavior and transformed into non-standardisms, like the following examples:

```js
import icon from './icon.svg';
import data from './data.json';
import styles from './styles.css';
import whatever from '~/whatever.js';
import transformed from 'transform:whatever.js';
```

None of these examples will actually work in a browser, because they are _non-standard_. Some of you might have correctly spotted that a browser standard exists for two of the imports pointed out in the example, namely the [Import Attributes proposal](https://github.com/tc39/proposal-import-attributes) (previously known as Import Assertions), but these imports in their current shape will not work natively in a browser. Many of these non-standard imports exist for good reason; they are very convenient. 

Other conveniences may include any kind of build-time transformations; like for example JSX. Nobody wants to write `createElement` calls by hand, but JSX will not run in a browser as is. The same goes for TypeScript. Developers evidently are very happy writing types in their source code (and will get [very upset](https://dev.to/thepassle/using-typescript-without-compilation-3ko4) when you tell them you can use TypeScript _without_ compiling your code), but alas, TypeScript source code does not run natively in the browser. Not until the [Type Annotations proposal](https://tc39.es/proposal-type-annotations/) lands anyway, which is only stage 1 at the time of writing.

Using Node.js globals like `process.env` to enable special development-time logging is another convenience often added by libraries, but will also cause runtime errors in the browser when not specifically handled by adding additional tooling.

It is important to note that this is not to say that anything that doesn't run natively in the browser is _wrong_ or _bad_. Exactly the opposite is true; It is _convenient_. Keep reading. It's also important to note that these are only _some_ examples of conveniences.


## The cost

The problem with conveniences is that they come at a cost. How easy is it to add this one little convenience that will surely make our lives better, never think about it again and move on.

It should come as no surprise to anybody that the frontend tooling ecosystem is complex, and in large part stems from the conveniences developers insist upon. When we apply a convenience to one tool, we have to now also make sure all of our _other_ tooling plays nice with it, and enforce everything to also support anything. Whenever _new_ tooling comes about, it is then also pressured into supporting these conveniences for it to ever be able to catch on, and to ease migrations to it.

But more concerningly, we become so accustomed to our toolchains and conveniences, that it often leads to _assumptions_ of other people using the same toolchain as you do. Which  then leads to packages _containing_ conveniences to be published to the NPM registry. This, as you might have guessed, forces other projects to also adopt additional tooling to be able to support these packages that they want to use, and cause a never-ending spiral of imposed conveniences.

It is disappointing to see that we have still not learned from the mistakes made by the recently sunsetted starter kit of one of the most popular JavaScript frameworks over the past decade, when contemporary popular development tools are making the exact same mistakes as the one before it by enabling conveniences _out of the box_.

Where you apply conveniences, you apply lock in. What happens when the next, faster tool comes out? Will it support all of your conveniences? 

## The conclusion

Is this all to say that conveniences are bad? Are they not helpful, and not valuable? Should our tooling not be allowed to support conveniences? Should they be shunned, or should tooling not support them? Are they simply _wrong_? The answer is no. Conveniences have their merits and are undeniably valuable. But they come at a cost, and tools should absolutely not enable them _by default_.

Additionally, when you build for the lowest common denominator and don't rely on conveniences, your code will work anywhere. It ensures compatibility with new tools and web standards, eliminating conflicts. This practice is sometimes referred to as _buildless development_. While it may seem unnecessary to prioritize portability, the importance of this approach becomes evident when circumstances change; you might be right, until you're not.

And finally, you might actually find it _refreshing_ to try frontend development without all the bells and whistles. Maybe you'll find that buildless development can get you pretty far, you'll often really only need a dev server with node resolution to resolve bare module specifiers, if at all. Maybe try it out some time.