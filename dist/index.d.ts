export declare const delegate: <T>() => {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
export declare const pause: (ms: number, autoStart?: boolean) => {
    start: () => {
        promise: Promise<void>;
        reject: () => void;
    };
    promise: Promise<void>;
    reject: () => void;
};
export declare const pauseIncrement: (range: [number, number], ms: [number, number], limit?: boolean) => (autoStart?: boolean) => {
    start: () => {
        promise: Promise<void>;
        reject: () => void;
    };
    promise: Promise<void>;
    reject: () => void;
};
export declare const singleton: <T extends (...args: any[]) => Promise<unknown>, H extends (...args: Parameters<T>) => string>(fn: T, hashFn?: H) => (...args: Parameters<T>) => ReturnType<T>;
export declare const debounce: <T extends (...args: any[]) => Promise<unknown>>(threshold: number, fn: T) => (...args: Parameters<T>) => ReturnType<T>;
export declare const throttle: <T extends (...args: any[]) => Promise<unknown>, H extends (...args: Parameters<T>) => string>(threshold: number, fn: T, hashFn?: H) => (...args: Parameters<T>) => ReturnType<T>;
export declare const mapRange: (value: number, source: [number, number], target: [number, number]) => number;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const poll: <T extends () => Promise<unknown>>(fn: T, test: (d: Awaited<ReturnType<T>>) => boolean, threshold: [number, number], max: number) => Promise<Awaited<ReturnType<T>>>;
