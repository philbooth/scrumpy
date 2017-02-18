/* eslint-env mocha */

'use strict'

const { assert } = require('chai')
const scrumpy = require('.')

test('interface is correct', () => {
  assert.isFunction(scrumpy)
  assert.lengthOf(scrumpy, 2)
})

test('finds match at root', () =>
  assert.deepEqual(scrumpy({ foo: 'bar' }, { foo: 'bar' }), [ { foo: 'bar' } ])
)

test('finds match among many properties', () =>
  assert.deepEqual(
    scrumpy(
      { foo: 'bar', baz: 'qux', wibble: 'blee' },
      { baz: 'qux' }
    ),
    [ { foo: 'bar', baz: 'qux', wibble: 'blee' } ]
  )
)

test('finds match in descendants', () =>
  assert.deepEqual(
    scrumpy(
      { foo: { bar: { baz: 'qux' } } },
      { baz: 'qux' }
    ),
    [ { baz: 'qux' } ]
  )
)

test('finds match spanning generations', () =>
  assert.deepEqual(
    scrumpy(
      { foo: 'foo', bar: { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } } },
      { baz: { qux: 'qux' } }
    ),
    [ { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } } ]
  )
)

test('finds multiple matches', () =>
  assert.deepEqual(
    scrumpy(
      { foo: 'foo', bar: { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } }, baz: { baz: { wibble: 'wibble', blee: 'blee', qux: 'qux' } } },
      { baz: { qux: 'qux' } }
    ),
    [
      { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } },
      { baz: { wibble: 'wibble', blee: 'blee', qux: 'qux' } }
    ]
  )
)

test('finds a single root that has multiple dependent matches', () =>
  assert.deepEqual(
    scrumpy(
      { foo: 'foo', bar: { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } }, baz: { wibble: 'wibble', blee: 'blee', qux: 'qux' } },
      { baz: { qux: 'qux' } }
    ),
    [
      { foo: 'foo', bar: { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } }, baz: { wibble: 'wibble', blee: 'blee', qux: 'qux' } }
    ]
  )
)

test('does not find match in descendants when recursion is disabled', () =>
  assert.deepEqual(
    scrumpy(
      { foo: { bar: { baz: 'qux' } } },
      { baz: 'qux' },
      { recursive: false }
    ),
    []
  )
)

test('finds matches in array descendants', () =>
  assert.deepEqual(
    scrumpy(
      [ { foo: 'bar' }, { baz: 'qux', v: 1 }, { wibble: 'blee', glarg: { baz: 'qux', v: 2 } } ],
      { baz: 'qux' }
    ),
    [ { baz: 'qux', v: 1 }, { baz: 'qux', v: 2 } ]
  )
)

test('finds immediate match in array descendants when recursion is disabled but arrays are enabled', () =>
  assert.deepEqual(
    scrumpy(
      [ { foo: 'bar' }, { baz: 'qux', v: 1 }, { wibble: 'blee', glarg: { baz: 'qux', v: 2 } } ],
      { baz: 'qux' },
      { recursive: false }
    ),
    [ { baz: 'qux', v: 1 } ]
  )
)

test('finds matches in array descendants when array is disabled but recursion is enabled', () =>
  assert.deepEqual(
    scrumpy(
      [ { foo: 'bar' }, { baz: 'qux', v: 1 }, { wibble: 'blee', glarg: { baz: 'qux', v: 2 } } ],
      { baz: 'qux' },
      { array: false }
    ),
    [ { baz: 'qux', v: 1 }, { baz: 'qux', v: 2 } ]
  )
)

test('does not find match in array descendants when recursion and arrays are disabled', () =>
  assert.deepEqual(
    scrumpy(
      [ { foo: 'bar' }, { baz: 'qux' }, { wibble: 'blee', glarg: { baz: 'qux' } } ],
      { baz: 'qux' },
      { recursive: false, array: false }
    ),
    []
  )
)

test('finds matches in non-root array descendants', () =>
  assert.deepEqual(
    scrumpy(
      { array: [ { foo: 'bar' }, { baz: 'qux', v: 1 }, { wibble: 'blee', glarg: { baz: 'qux', v: 2 } } ] },
      { baz: 'qux' }
    ),
    [ { baz: 'qux', v: 1 }, { baz: 'qux', v: 2 } ]
  )
)

test('finds match in infinitely recursive trees', () => {
  const recursive = {
    foo: {
      bar: {
        baz: {
          qux: 'qux'
        }
      }
    }
  }
  recursive.foo.bar.qux = recursive
  assert.deepEqual(scrumpy(recursive, { qux: 'qux' }), [ { qux: 'qux' } ])
})

test('finds first match', () =>
  assert.deepEqual(
    scrumpy(
      { foo: 'foo', bar: { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } }, baz: { baz: { wibble: 'wibble', blee: 'blee', qux: 'qux' } } },
      { baz: { qux: 'qux' } },
      { all: false }
    ),
    [
      { bar: 'bar', baz: { baz: 'baz', qux: 'qux' } }
    ]
  )
)

