# promise utils
Various promise utilities
## Usage

### import
```typescript
import { poll } from "oj-dom-utils"
```


### poll
```typescript
await poll(
  () => fetch(url).then(x => x.text()), // function, must return Promise
  x => x === "ok", // test function, must return boolean
  [500, 10000], // timeouts [start ms, end ms]
  10 // maximum attempts, timeouts are mapped to this value (lineair)
)
```
### pause
```typescript
await pause(1000) // pauses for 1 second
```
### pauseIncrement
```typescript
const pause = await pauseIncrement([0,4], [100, 2000], true)
await pause() // pauses for 100 ms
await pause() // pauses for 575 ms
await pause() // pauses for 1050 ms
await pause() // pauses for 1525 ms
await pause() // pauses for 2000 ms
await pause() // pauses for 2000 ms etc ...
```
### delegate
```typescript
const d = delegate<boolean>()
// use d.promise somewhere
d.resolve(true) // d.promise is resolved

```
### singleton
```typescript
const get = singleton(() => fetch(url).then(x => x.json()))
get() // executes api call
get() // reuses previous call and returns that promise
await get() // reuses previous call and returns that promise
get() // executes api call because the previous call was resolved, returns a new promise
```
### debounce
```typescript
const get = debounce(1000, () => fetch(url).then(x => x.json()))
```
### throttle
```typescript
const get = throttle(1000, () => fetch(url).then(x => x.json()))
```