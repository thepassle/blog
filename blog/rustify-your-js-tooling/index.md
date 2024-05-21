---
title: Rustify your js tooling
description: A little overview on how to start using Rust code in your existing JS codebases
updated: 2024-05-21
---

# Rustify your js tooling

A big part of my work revolves around JavaScript tooling, and as such it's important to keep an eye on the ecosystem and see where things are going. It's no secret that recently lots of projects are native-ying (??) parts of their codebase, or even rewriting them to native languages altogether. [Esbuild](https://esbuild.github.io/) is one of the first popular and successful examples of this, which was written in Go. Other examples are [Rspack](https://www.rspack.dev/) and [Turbopack](https://turbo.build/pack), which are both Rust-based alternatives to Webpack, powered by [SWC](https://swc.rs/) ("Speedy Web Compiler"). There's also [Rolldown](https://rolldown.rs/), a Rust-based alternative to Rollup powered by [OXC](https://oxc-project.github.io/) ("The JavaScript Oxidation Compiler"), but [Rollup](https://rollupjs.org/) itself is also native-ying (??) parts of their codebase and recently started using SWC for parts of their codebase. And finally, there are [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) (powered by OXC) and [Biome](https://biomejs.dev/) as Rust-based alternatives for [Eslint](https://eslint.org/) and [Prettier](https://prettier.io/) respectively.

Having said all that, there definitely seems to be a big push to move lots of JavaScript tooling to Rust, and as mentioned above, as someone working on JavaScript tooling it's good to stick with the times a bit, so I've been keeping a close eye on these developments and learning bits of Rust here and there in my spare time. While I've built a couple of hobby projects with Rust, for a long time I haven't really been able to really apply my Rust knowledge at work, or other tooling projects. One of the big reasons for that was that a lot of the necessary building blocks either simply weren't available yet, or not user-friendly (for a mostly mainly JS dev like your boy) enough.

That has changed.

Notably by projects like OXC and [Napi-rs](https://napi.rs/), and these projects combined make for an absolute powerhouse for tooling. A lot of the tooling I work on have to do with some kind of analysis, AST parsing, module graph crawling, codemodding, and other dev tooling related stuff; but a lot of very AST-heavy stuff. OXC provides some really great projects to help with this, and I'll namedrop a few of them here.

## Lil bit of namedropping

Starting off with [**oxc_module_lexer**](https://crates.io/crates/oxc_module_lexer). Admittedly not an actual lexer; it actually does do a full parse of the code, but achieves the same result as the popular `es-module-lexer`, but made very easy to use in Rust. If you're not a dummy like me, you're probably able to get `es-module-lexer` up and running in Rust. For me, it takes days of fiddling around, not knowing what I'm doing, and getting frustrated. I just want to install a crate that works and be on my way and write some code. There is also a fork of `es-module-lexer` made by the creator of Parcel, but it's not actually published on crates.io, and so you have to install it via a Github link, which makes me a bit squeemish in terms of versioning/breakage, so just being able to use `oxc_module_lexer` is really great. Very useful for _lots_ of tooling. Here's a small example:

```rust
let allocator = Allocator::default();
let ret = Parser::new(&allocator, &source, SourceType::default()).parse();
let ModuleLexer { exports, imports, .. } = ModuleLexer::new().build(&ret.program);
```

Next up there's [**oxc_resolver**](https://crates.io/crates/oxc_resolver) which implements node module resolution in Rust, super useful to have available in Rust:

```rust
let options = ResolveOptions {
  condition_names: vec!["node".into(), "import".into()],
  main_fields: vec!["module".into(), "main".into()],
  ..ResolveOptions::default()
};

let resolver = Resolver::new(options);
let resolved = resolver.resolve(&importer, importee).unwrap();
```

And finally [**oxc_parser**](https://crates.io/crates/oxc_parser), which parses JS/TS code and gives you the AST so you can do some AST analysis:

```rust
let ret = Parser::new(
  Allocator::default(), 
  &source_code, 
  SourceType::default()
).parse();

let mut variable_declarations = 0;
for declaration in ret.program.body {
  match declaration {
    Statement::VariableDeclaration(variable) => {
      variable_declarations += variable.declarations.len();
    }
    _ => {}
  }
}
```

With these things combined, you can already build some pretty powerful (and fast) tooling. However, we still need a way to be able to consume this Rust code on the JavaScript side in Node. That's where Napi-rs comes in.

## Using your Rust code in Node

> "NAPI-RS is a framework for building pre-compiled Node.js addons in Rust."

Or for dummy's: rust code go brrrr

Conveniently, Napi-rs provides a starter project that you can find [here](https://github.com/napi-rs/package-template/tree/main), which makes getting setup very easy. I will say however, that the starter project comes with quite a lot of bells and whistles; and the first thing I did was cut a lot of the stuff I didn't absolutely need out. When I'm starting out with a new tool or technology I like to keep things very simple and minimal.

Alright, let's get to some code. Consider the previous example where we used the **oxc_parser** to count all the top-level variable declarations in a file, our Rust code would look something like this:

```rust
use napi::{Env};
use napi_derive::napi;
use oxc_allocator::Allocator;
use oxc_ast::ast::Statement;
use oxc_parser::Parser;
use oxc_span::SourceType;

#[napi]
pub fn count_variables(env: Env, source_code: String) -> Result<i32> {
  let ret = Parser::new(
    Allocator::default(), 
    &source_code, 
    SourceType::default()
  ).parse();

  let mut variable_declarations = 0;
  for declaration in ret.program.body {
    match declaration {
      Statement::VariableDeclaration(variable) => {
        variable_declarations += variable.declarations.len();
      }
      _ => {}
    }
  }
  Ok(variable_declarations)
}
```

Even if you've never written Rust, you can probably still tell what this code does and if not, that's okay too because I'm still gonna explain it anyway.

In this Rust code we create a function that takes some `source_code`, which is just some text. We then create a new `Parser` instance, pass it the `source_code`, and have it parse it. Then, we loop through the AST nodes in the program, and for every `VariableDeclaration`, we add the number of declarations (a variable declaration can have multiple declarations, e.g.: `let foo, bar;`) to `variable_declarations`, and finally we return an `Ok` result.

And what's cool about Napi is that you don't have to communicate _just_ via strings only; you can pass [many different data types](https://napi.rs/docs/concepts/values) back and forth between Rust and JavaScript, and you can even pass callbacks from JS. Consider the following example:

```rust
#[napi]
pub fn foo(env: Env, callback: JsFunction) {
  // We call the callback from JavaScript on the Rust side, and pass it a string
  let result = callback.call1::<JsString, JsUnknown>(
    env.create_string("Hello world".to_str().unwrap())?,
  )?;

  // The result of this callback can either be a string or a boolean
  match &result.get_type()? {
    napi::ValueType::String => {
      let js_string: JsString = result.coerce_to_string()?;
      // do something with the string
    }
    napi::ValueType::Boolean => {
      let js_bool: JsBoolean = result.coerce_to_bool()?;
      // do something with the boolean
    }
    _ => {
      println!("Expected a string or a boolean");
    }
  }
}
```

Which we can then use on the JavaScript side like this:

```js
import { foo } from './index.js';

foo((greeting) => {
  console.log(greeting); // "Hello world"
  return "Good evening";
});
```

This is really cool, because it means you'll be able to create plugin systems for your Rust-based programs with the flexibility of JS/callbacks, which previously seemed like a big hurdle for Rust-based tooling.

Alright, back to our `count_variables` function. Now that we have the Rust code, we'll want to smurf it into something that we can actually consume on the JavaScript side of things. Since I'm using the napi-rs starter project, I can run the `npm run build` script, and it'll compile the Rust code, and provide me with an `index.d.ts` file that has the types for my `count_variables` function, which looks something like this:

```ts
/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function countVariables(sourceCode: string): number
```

As well as a generated `index.js` file which actually loads the bindings and exposes the function. The file is pretty long, but at the end of it you'll see this:

```ts
// ... etc, other code

const { countVariables } = nativeBinding

module.exports.countVariables = countVariables
```

Next up, you can simply create a `run.js` file:

```js
import { countVariables } from 'index.js';

console.log(countVariables(`let foo, bar;`)); // 2
```

And it Just Works™️. Super easy to write some rust code, and just consume it in your existing JS projects.

## Publishing

Publishing with the Napi-rs starter admittedly wasn't super clear to me, and took some fiddling with to get it working. For starters, you _have_ to use Yarn instead of NPM, otherwise Github Action the starter repo comes with will fail because it's unable to find a yarn.lock file. Im sure it's not rocket science to refactor the Github Action to use NPM instead, but it's a fairly big (~450 loc) `.yml` file and I just want to ship some code. Additionally, if you want to actually _publish_ the code, the commit message has to conform to: `grep "^[0-9]\+\.[0-9]\+\.[0-9]\+"`. This was a bit frustrating to find out because the CI job took about half an hour (although I suspect something was up at Github Actions today making it slower than it actually should be) to reach the `"Publish"` stage, only for me to find out it wouldn't actually publish.

## In conclusion

I think all of these developments are just really cool, which is why I wanted to do a quick blog on it, but the point I wanted to get across here is; Go try this out, clone the Napi-rs starter template, write some Rust, and see if you can integrate something in your existing Node projects, I think you'd be surprised at how well all this works. If I can do it, so can you. Having said that, there are definitely rough edges, and I think there are definitely some things that can be improved to make getting started with this a bit easier, but I'm sure those will come to pass in time; hopefully this blogpost will help someone figure out how to get up and running and play with this as well.

And finally, a big shoutout to the maintainers of Napi-rs and OXC, they're really cool and friendly people and their projects are super cool.