'use strict'

module.exports = scrump

function scrump (node, criteria, { recursive = true, array = true, visited = new Set() } = {}) {
  if (visited.has(node)) {
    return []
  }

  visited.add(node)

  if (match(node, criteria)) {
    return [ node ]
  }

  if (Array.isArray(node) && array) {
    return node.reduce((results, item) => {
      return results.concat(scrump(item, criteria, { recursive, array, visited }))
    }, [])
  }

  if (isObject(node) && recursive) {
    return Object.keys(node).reduce((results, key) => {
      return results.concat(scrump(node[key], criteria, { visited }))
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

function isObject (node) {
  return node && typeof node === 'object'
}

