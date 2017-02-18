'use strict'

module.exports = scrump

function scrump (node, criteria, { recursive = true, array = true } = {}) {
  if (match(node, criteria)) {
    return [ node ]
  }

  if (Array.isArray(node) && array) {
    return node.reduce((results, property) => {
      return results.concat(scrump(property, criteria, { recursive, array }))
    }, [])
  }

  if (isObject(node) && recursive) {
    return Object.keys(node).reduce((results, key) => {
      return results.concat(scrump(node[key], criteria))
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

