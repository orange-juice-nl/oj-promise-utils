export const delegate = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

export const pause = (ms: number, autoStart = true) => {
  const d = delegate<void>()
  const promise = d.promise
  let timer: any
  const reject = () => {
    clearTimeout(timer)
    d.reject("pause canceled")
  }
  const start = () => {
    if (timer)
      throw new Error("timer already executed, autoStart param is true")
    timer = setTimeout(d.resolve, ms)
    return { promise, reject }
  }

  if (autoStart)
    start()

  return { start, promise, reject }
}

export const pauseIncrement = (range: [number, number], ms: [number, number], limit = true) => {
  let i = 0

  return (autoStart = true) => {
    let s = mapRange(i++, range, ms)
    if (limit)
      s = clamp(s, ms[0], ms[1])
    return pause(s, autoStart)
  }
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
  let d: ReturnType<typeof delegate>|undefined

  return (...args: Parameters<T>) => {
    if (!d)
      d = delegate()

    clearTimeout(t)
    t = setTimeout(() => {
      const p = fn(...args)
      p.then(x => d?.resolve(x))
      p.catch(x => d?.reject(x))
      p.finally(() => d = undefined)
    }, threshold)

    return d.promise as ReturnType<T>
  }
}

export const throttle = <T extends (...args: any[]) => Promise<unknown>, H extends (...args: Parameters<T>) => string>(threshold: number, fn: T, hashFn?: H) => {
  let n: number
  let p: ReturnType<T>
  let h: string

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const hn = hashFn?.(...args) ?? JSON.stringify(args)
    if (!n || now - n >= threshold || h !== hn) {
      n = now
      h = hn
      p = fn(...args) as any
    }
    return p
  }
}

export const mapRange = (value: number, source: [number, number], target: [number, number]) =>
  target[0] + (value - source[0]) * (target[1] - target[0]) / (source[1] - source[0])

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const poll = async <T extends () => Promise<unknown>>(fn: T, test: (d: Awaited<ReturnType<T>>) => boolean, threshold: [number, number], max: number): Promise<Awaited<ReturnType<T>>> => {
  const now = Date.now()
  let i = 0
  const pi = pauseIncrement([0, max], threshold)

  while (i++ < max) {
    try {
      const x = await fn() as any
      if (test(x))
        return x
    }
    catch (err) {
      console.error(err)
    }

    await pi().promise
  }

  throw new Error(`poll reached timeout (${Date.now() - now} ms)`)
}