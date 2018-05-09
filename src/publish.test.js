const assert = require('assert')

const {
  default: publish
} = require('./publish')

describe('publish', function () {
  it('should execute each function with key, value in subscribers', function () {
    let counter = 0

    const subscribers = {
      0: (a, b) => counter = counter + (a * 1) + (b * 1),  // 5
      1: (a, b) => counter = counter + (a * 2) + (b * 2),  // 10
      2: (a, b) => counter = counter + (a * 3) + (b * 3),  // 15
    }

    publish(subscribers, 2, 3)
    assert.strictEqual(counter, 30)
  })

  it('should execute each function in subscribers in numerical order of keys', function () {
    let counter = 0

    const subscribers = {
      '5': () => {
        counter = counter + 5
        assert.strictEqual(counter, 7)
      },
      '2': () => {
        counter = counter + 2
        assert.strictEqual(counter, 2)
      },
      '8': () => {
        counter = counter + 8
        assert.strictEqual(counter, 15)
      }
    }

    publish(subscribers)
  })
})
