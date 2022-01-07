export const pause = async (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    return () => {
      clearTimeout(timeout)
      reject("pause canceled")
    }
  })

export const pauseIncrement = (range: [number, number], ms: [number, number], limit = true) => {
  let i = 0

  return () => {
    let s = mapRange(i++, range, ms)
    if (limit)
      s = clamp(s, ms[0], ms[1])
    return pause(s)
  }
}

export const delegate = <T>() => {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: any) => void
  let promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

export const singleton = <T extends (...args: any[]) => Promise<unknown>, H extends (...args: Parameters<T>) => string>(fn: T, hashFn?: H) => {
  const cache: Record<string, Promise<unknown>> = {}

  return (...args: Parameters<T>) => {
    const hash = hashFn?.(...args) ?? JSON.stringify(args)
    if (!cache[hash]) {
      cache[hash] = fn(...args)
      cache[hash].finally(() => delete cache[hash])
    }
    return cache[hash] as ReturnType<T>
  }
}

export const debounce = <T extends (...args: any[]) => Promise<unknown>>(threshold: number, fn: T) => {
  let t: any
  let d: ReturnType<typeof delegate>
  return (...args: Parameters<T>) => {
    if (!d) {
      d = delegate()
      d.promise.finally(() => d = undefined)
    }

    clearTimeout(t)
    t = setTimeout(() => {
      const p = fn(...args)
      p.then(x => d?.resolve(x))
      p.catch(x => d?.reject(x))
    }, threshold)

    return d.promise as ReturnType<T>
  }
}

export const throttle = <T extends (...args: any[]) => Promise<unknown>>(threshold: number, fn: T, tail = false) => {
  let t: any
  let n: number
  let d: ReturnType<typeof delegate>
  return (...args: Parameters<T>) => {
    if (!d) {
      d = delegate()
      d.promise.finally(() => d = undefined)
    }

    clearTimeout(t)
    const now = Date.now()
    if (!n || now - n >= threshold) {
      n = now
      const p = fn(...args)
      p.then(x => d?.resolve(x))
      p.catch(x => d?.reject(x))
    }
    else if (tail)
      t = setTimeout(() => {
        const p = fn(...args)
        p.then(x => d?.resolve(x))
        p.catch(x => d?.reject(x))
      }, threshold)

    return d.promise as ReturnType<T>
  }
}

export const mapRange = (value: number, source: [number, number], target: [number, number]) =>
  target[0] + (value - source[0]) * (target[1] - target[0]) / (source[1] - source[0])

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const poll = async (fn: () => Promise<boolean>, threshold: [number, number], max: number) => {
  let i = 0
  const pi = pauseIncrement([0, max], threshold)

  while (i < max) {
    const x = await fn()
    if (x)
      return

    await pi()
  }

  throw new Error(`poll reached timeout (${max} ms)`)
}