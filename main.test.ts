import { MiniDataLoader } from './main';

const asyncMockFn = (keys: number[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(keys.map((key) => key ** 2));
    }, 200);
  });
};

describe('MiniDataLoader', () => {
  it('Should be executed 1 time with multiple load calls', async () => {
    const batchLoaderFn = jest.fn().mockImplementation(asyncMockFn);
    const loader = new MiniDataLoader(batchLoaderFn);

    await Promise.all([
      loader.load(1),
      loader.load(2),
      loader.load(3),
      loader.load(4),
    ]);

    expect(batchLoaderFn).toHaveBeenCalledTimes(1);
  });

  it('Should be executed with different keys on each tick', async () => {
    const batchLoaderFn = jest.fn().mockImplementation(asyncMockFn);
    const loader = new MiniDataLoader(batchLoaderFn);

    const callArgs1 = [1, 2, 3];
    const callArgs2 = [4, 5, 6];

    await Promise.all(callArgs1.map(loader.load));
    expect(batchLoaderFn).toHaveBeenCalledWith(callArgs1);

    await Promise.all(callArgs2.map(loader.load));
    expect(batchLoaderFn).toHaveBeenCalledWith(callArgs2);
  });
});

