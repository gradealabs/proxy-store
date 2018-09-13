import * as assert from 'assert'
import publish from './publish'

describe('publish', function () {
  it('should execute each function', function () {
    let counter = 0

    const subscribers = [
      () => counter++,
      () => counter++,
      () => counter++
    ]

    publish(subscribers)
    assert.strictEqual(counter, 3)
  })

  it('should send change parameter to subscribers', function () {
    const subscribers = [
      (a) => assert.strictEqual(a, 1),
      (a) => assert.strictEqual(a, 1),
      (a) => assert.strictEqual(a, 1)
    ]

    publish(subscribers, 1)
  })
})
