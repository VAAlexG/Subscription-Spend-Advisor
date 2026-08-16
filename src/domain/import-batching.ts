export const D1_MAX_BOUND_PARAMETERS = 100;

export function chunkForBoundParameters<T>(
  values: readonly T[],
  parametersPerValue: number,
  reservedParameters = 0,
): T[][] {
  if (!Number.isInteger(parametersPerValue) || parametersPerValue < 1) {
    throw new Error("parametersPerValue must be a positive integer");
  }
  if (!Number.isInteger(reservedParameters) || reservedParameters < 0) {
    throw new Error("reservedParameters must be a non-negative integer");
  }

  const availableParameters = D1_MAX_BOUND_PARAMETERS - reservedParameters;
  const valuesPerChunk = Math.floor(availableParameters / parametersPerValue);
  if (valuesPerChunk < 1) {
    throw new Error("At least one value must fit within the D1 parameter limit");
  }

  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += valuesPerChunk) {
    chunks.push(values.slice(index, index + valuesPerChunk));
  }
  return chunks;
}

export function uniqueByKey<T>(values: readonly T[], getKey: (value: T) => string) {
  const unique = new Map<string, T>();
  let duplicates = 0;

  for (const value of values) {
    const key = getKey(value);
    if (unique.has(key)) {
      duplicates += 1;
    } else {
      unique.set(key, value);
    }
  }

  return { values: [...unique.values()], duplicates };
}
