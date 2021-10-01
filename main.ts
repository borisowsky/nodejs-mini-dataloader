
export class MiniDataLoader<K, V> {
  private queue = new Set();

  constructor(private batchLoaderFn: (keys: K[]) => Promise<V>) {}

  dispatchQueue = () => {
    const keysArray = Array.from(this.queue);
    this.queue = new Set();

    if (keysArray.length > 0) {
      this.batchLoaderFn(keysArray.map(({ key }) => key)).then((values) => {
        keysArray.forEach(({ resolve }, i: number) => {
          resolve(values[i]);
        });
      });
    }
  };

  load = (key: K): Promise<V> => {
    return new Promise((resolve) => {
      this.queue.add({ key, resolve });
      queueMicrotask(() => process.nextTick(this.dispatchQueue));
    });
  }
}
