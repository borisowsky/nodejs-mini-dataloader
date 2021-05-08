export type DataLoaderKey = number;
type DataLoaderResolver = (value: unknown) => void;

export class MiniDataLaoder {
  private batchLoaderFn: (keys: DataLoaderKey[]) => Promise<any>;
  private queue: Set<{
    key: DataLoaderKey;
    resolve: DataLoaderResolver;
  }> = new Set();

  constructor(batchLoaderFn: (keys: DataLoaderKey[]) => Promise<any>) {
    this.batchLoaderFn = batchLoaderFn;
  }

  dispatchQueue = () => {
    const keysArray = Array.from(this.queue);
    this.queue = new Set();

    if (keysArray.length > 0) {
      this.batchLoaderFn(keysArray.map((k) => k.key)).then((values) => {
        keysArray.forEach(({ resolve }, i: number) => {
          resolve(values[i]);
        });
      });
    }
  };

  load(key: DataLoaderKey) {
    const promisedValue = new Promise((resolve) => {
      this.queue.add({ key, resolve });

      queueMicrotask(this.dispatchQueue);
    });

    return promisedValue;
  }
}
