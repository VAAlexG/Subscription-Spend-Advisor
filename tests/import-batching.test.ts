import { describe, expect, it } from "vitest";
import {
  D1_MAX_BOUND_PARAMETERS,
  chunkForBoundParameters,
  uniqueByKey,
} from "@/domain/import-batching";

describe("D1 import batching", () => {
  it("keeps transaction insert statements within D1's 100-parameter limit", () => {
    const rows = Array.from({ length: 1_124 }, (_, index) => index);
    const chunks = chunkForBoundParameters(rows, 12);

    expect(chunks).toHaveLength(141);
    expect(chunks.flat()).toEqual(rows);
    expect(Math.max(...chunks.map((chunk) => chunk.length * 12))).toBeLessThanOrEqual(
      D1_MAX_BOUND_PARAMETERS,
    );
  });

  it("reserves firm and client parameters when checking existing fingerprints", () => {
    const fingerprints = Array.from({ length: 1_124 }, (_, index) => `fingerprint-${index}`);
    const chunks = chunkForBoundParameters(fingerprints, 1, 2);

    expect(chunks).toHaveLength(12);
    expect(Math.max(...chunks.map((chunk) => chunk.length + 2))).toBeLessThanOrEqual(
      D1_MAX_BOUND_PARAMETERS,
    );
  });

  it("removes duplicates within the uploaded file before querying D1", () => {
    const result = uniqueByKey(
      [{ fingerprint: "a" }, { fingerprint: "b" }, { fingerprint: "a" }],
      (row) => row.fingerprint,
    );

    expect(result.values).toEqual([{ fingerprint: "a" }, { fingerprint: "b" }]);
    expect(result.duplicates).toBe(1);
  });
});
