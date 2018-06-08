export default function publish (subscribers, change) {
  const subIds = Object.keys(subscribers).map(parseFloat).sort()

  subIds.forEach(subId => {
    const fn = subscribers[subId]
    fn(change)
  })
}
