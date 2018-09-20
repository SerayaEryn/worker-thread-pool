'use strict'

module.exports = class List {
  constructor () {
    this.first = null
    this.length = 0
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
