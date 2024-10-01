export const atLeast = <T, U extends number>(
  value: T[],
  min: PositiveInteger<U>,
): value is AtLeast<T, U> => {
  return value.length >= min;
};

type PositiveInteger<T extends number> = `${T}` extends `-${number}` | "0" | `${number}.${number}`
  ? never
  : T;

type AtLeast<T, N extends number, Acc extends T[] = []> = `${N}` extends `-${N}`
  ? []
  : Acc["length"] extends N
    ? [...Acc, ...T[]]
    : AtLeast<T, N, [...Acc, T]>;
