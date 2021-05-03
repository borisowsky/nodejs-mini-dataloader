type DataLoaderKey = number;
type DataLoaderResolver = (value: unknown) => void;

class MiniDataLaoder {
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
      console.log(
        'Executed once with keys:',
        keysArray.map((item) => item.key),
      );

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

// Mock
const loadSomeData = (keys: DataLoaderKey[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(keys.map((key) => key ** 2));
    }, 1000);
  });
};

const myCustomLoader = new MiniDataLaoder(loadSomeData);

myCustomLoader.load(1).then(console.log);
myCustomLoader.load(2).then(console.log);
myCustomLoader.load(3).then(console.log);
myCustomLoader.load(4).then(console.log);

setTimeout(() => {
  myCustomLoader.load(5).then(console.log);
  myCustomLoader.load(6).then(console.log);
  myCustomLoader.load(7).then(console.log);
  myCustomLoader.load(8).then(console.log);
}, 100);

setTimeout(() => {
  myCustomLoader.load(9).then(console.log);
  myCustomLoader.load(10).then(console.log);
  myCustomLoader.load(11).then(console.log);
  myCustomLoader.load(12).then(console.log);
}, 200);
