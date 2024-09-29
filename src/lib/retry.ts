import { range } from "remeda";

import { sleep } from "./sleep";

export const retry = async <T>(fn: () => T | undefined, times: number): Promise<T> => {
  for (const _ of range(0, times)) {
    const result = fn();

    if (result) return result;

    await sleep(1000);
  }

  throw new Error("Retry Failed");
};
