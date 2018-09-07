'use strict'

module.exports = class List {
  constructor () {
    this.first = null
    this.length = 0
  }

  [Symbol.iterator] () {
    let node = { next: this.first }
    return {
      next () {
        node = node.next
        const done = node === null
        return {
          value: done ? null : node.element,
          done
        }
      }
    }
  }

  push (element) {
    this.first = {
      element,
      next: this.first
    }
    this.length++
  }

  shift () {
    const element = this.first.element
    this.first = this.first.next
    this.length--
    return element
  }
}
