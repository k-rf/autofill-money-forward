import { isNullish } from "remeda";

type Map<T extends readonly unknown[]> = { [K in keyof T]: Exclude<T[K], null> };

export const filled = <T extends readonly unknown[]>(args: T): args is Map<T> => {
  return !args.some(isNullish);
};

if (import.meta.vitest) {
  const { describe, it, expect, expectTypeOf } = import.meta.vitest;

  describe("filled", () => {
    it("すべての要素が存在とき、`true` を返す", () => {
      const input = [1, 2, 3] as [number | null, number | null, number | null];

      const actual = filled(input);

      expect(actual).toBe(true);
      if (actual) expectTypeOf(input).toEqualTypeOf<[number, number, number]>();
    });

    it("ある要素が `null` のとき、`false` を返す", () => {
      expect(filled([1, null, 3])).toBe(false);
    });

    it("ある要素が `undefined` のとき、`false` を返す", () => {
      expect(filled([1, 2, undefined])).toBe(false);
    });
  });
}
