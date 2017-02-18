'use strict'

module.exports = scrump

function scrump (
  node,
  criteria,
  {
    all = true,
    array = true,
    recursive = true,
    visited = new Set()
  } = {}
) {
  if (visited.has(node)) {
    return []
  }

  visited.add(node)

  if (match(node, criteria)) {
    return [ node ]
  }

  if (Array.isArray(node) && array) {
    return node.reduce((results, item) => {
      return recur(results, item, criteria, { all, array, recursive, visited })
    }, [])
  }

  if (isObject(node) && recursive) {
    return Object.keys(node).reduce((results, key) => {
      return recur(results, node[key], criteria, { all, visited })
    }, [])
  }

  return []
}

function match (node, criteria) {
  if (! isObject(node)) {
    if (node === criteria) {
      return true
    }

    return false
  }

  if (! isObject(criteria)) {
    return false
  }

  return Object.keys(criteria).every(criteriaKey => {
    return Object.keys(node).some(nodeKey => {
      return match(node[nodeKey], criteria[criteriaKey])
    })
  })
}

function recur (results, node, criteria, options) {
  if (! options.all && results.length > 0) {
    return results
  }

  return results.concat(scrump(node, criteria, options))
}

function isObject (node) {
  return node && typeof node === 'object'
}

