import { MiniDataLaoder } from './main';
import type { DataLoaderKey } from './main';

const asyncLoaderImplementation = (keys: DataLoaderKey[]) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(keys.map((key) => key ** 2)), 100);
  });
};

describe('MiniDataLaoder', () => {
  it('Should be executed `n` times due to `n` ticks', async () => {
    const asyncLoader = jest.fn().mockImplementation(asyncLoaderImplementation);
    const loader = new MiniDataLaoder(asyncLoader);

    await Promise.all([loader.load(1), loader.load(2), loader.load(3)]);
    await Promise.all([loader.load(1), loader.load(2), loader.load(3)]);
    await Promise.all([loader.load(1), loader.load(2), loader.load(3)]);

    expect(asyncLoader).toHaveBeenCalledTimes(3);
  });
});
