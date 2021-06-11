export declare const pause: (ms: number) => Promise<void>;
export declare const singleton: <T extends (...args: any[]) => Promise<any>>(fn: T) => T;
export declare const delegate: <T>() => {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
export declare const poll: <T>(fn: (done: (data: T) => void) => any, delay: number, timeout?: number) => Promise<T>;
