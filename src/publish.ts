export default function publish (subscribers, change = undefined) {
  const filtered = subscribers.filter(s => s)
  for (const fn of filtered) {
    fn(change)
  }
}
