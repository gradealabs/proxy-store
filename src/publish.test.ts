import * as assert from 'assert'
import publish from './publish'

describe('publish', function () {
  it('should execute each function', function () {
    let counter = 0

    const subscribers = {
      0: () => counter++,
      1: () => counter++,
      2: () => counter++
    }

    publish(subscribers)
    assert.strictEqual(counter, 3)
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

  it('should send change parameter to subscribers', function () {
    const subscribers = {
      0: (a) => assert.strictEqual(a, 1),
      1: (a) => assert.strictEqual(a, 1),
      2: (a) => assert.strictEqual(a, 1)
    }

    publish(subscribers, 1)
  })
})
