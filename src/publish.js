export default function publish (subscribers, key, value) {
  const subIds = Object.keys(subscribers).map(parseFloat).sort()

  subIds.forEach(subId => {
    const fn = subscribers[subId]
    fn(key, value)
  })
}
