# scrumpy

[![Package status](https://img.shields.io/npm/v/scrumpy.svg?style=flat-square)](https://www.npmjs.com/package/scrumpy)
[![Build status](https://img.shields.io/travis/philbooth/scrumpy.svg?style=flat-square)](https://travis-ci.org/philbooth/scrumpy)
[![License](https://img.shields.io/github/license/philbooth/scrumpy.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Scrumps all of the juiciest nodes from your trees!

* [You what?](#you-what)
* [What's it useful for?](#whats-it-useful-for)
* [How do I install it?](#how-do-i-install-it)
* [How do I use it?](#how-do-i-use-it)
  * [Loading the library](#loading-the-library)
  * [Finding nodes](#finding-nodes)
  * [Examples](#examples)
* [Does it handle recursive/circular tree structures?](#does-it-handle-recursivecircular-tree-structures)
* [Is there a change log?](#is-there-a-change-log)
* [How do I set up the dev environment?](#how-do-i-set-up-the-dev-environment)
* [What license is it released under?](#what-license-is-it-released-under)

## You what?

Given a tree of data
and criteria to identify
interesting nodes,
scrumpy will find matching nodes
in the tree.

## What's it useful for?

One use is
for finding nodes
in abstract syntax trees.

For instance,
if you want to find nodes
representing particular tokens
in the Mozilla-format AST
returned by [acorn](https://github.com/ternjs/acorn)
and [esprima](http://esprima.org/),
you have to walk the tree
and interrogate every node.

Instead, scrumpy takes
a root node and search criteria,
then returns an array
of matching nodes.

## How do I install it?

Via `npm`:

```
npm i scrumpy --save
```

Or if you just want the git repo:

```
git clone git@github.com:philbooth/scrumpy.git
```

## How do I use it?

### Loading the library

Use `require`:

```js
const scrumpy = require('scrumpy');
```

### Finding nodes

Call `scrumpy(tree, criteria)`,
where `tree` is the root node
to start the search from
and `criteria` is a subtree
of properties to match against:

```js
const nodes = scrumpy(tree, criteria);
```

### Examples

Find assignments to `module.exports`
in an abstract syntax tree:

```js
const nodes = scrumpy(ast, {
  type: 'ExpressionStatement',
  left: {
    type: 'MemberExpression',
	object: {
	  type: 'Identifier',
	  name: 'module'
	},
	property: {
	  type: 'Identifier',
	  name: 'exports'
	}
  }
})
```

### Options

There is also
an optional third argument
to scrumpy.
You can use it
to tweak the search behaviour:

```js
const nodes = scrump(tree, criteria, {
  recursive: false, // Set to false to only search the root level for matches.
  array: false      // Set to false to ignore array items when searching.
}
```

## Does it handle recursive/circular tree structures?

Yep.

## Is there a change log?

[Yes](CHANGELOG.md).

## How do I set up the dev environment?

To install the dependencies:

```
npm i
```

To run the tests:

```
npm t
```

To lint the code:

```
npm run lint
```

## What license is it released under?

[MIT](LICENSE).

