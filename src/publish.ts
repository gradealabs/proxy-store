export default function publish (subscribers, change = undefined) {
  for (const fn of subscribers) {
    fn(change)
  }
}
