export const pause = async (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    return () => {
      clearTimeout(timeout)
      reject("pause canceled")
    }
  })

export const singleton = <T extends (...args) => Promise<any>>(fn: T) => {
  let promise: Promise<any>

  return ((...args) => {
    promise ??= fn(...args)
    promise.then(() => promise = undefined)
    return promise
  }) as unknown as T
}

export const delegate = <T>() => {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

export const poll = <T>(fn: (done: (data: T) => void) => any, delay: number, timeout: number = 0) => {
  const { promise, resolve, reject } = delegate<T>()
  let done: boolean

  const handle = (data: T) => {
    done = true
    resolve(data)
  }

  const run = async () => {
    await fn(handle)
    while (!done) {
      await pause(delay)
      await fn(handle)
    }
  }

  if (timeout)
    pause(timeout)
      .then(() => reject("poll reached timeout"))

  run()

  return promise
}