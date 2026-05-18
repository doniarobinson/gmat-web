import { describe, expect, it } from "vitest";
import { mulberry32, pickOne, shuffle } from "@/lib/random";

describe("mulberry32", () => {
  it("returns the same sequence for the same seed", () => {
    const a = mulberry32(99);
    const b = mulberry32(99);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("returns different values for different seeds", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});

describe("shuffle", () => {
  it("preserves length and elements", () => {
    const input = [1, 2, 3, 4];
    const out = shuffle(mulberry32(99), input);
    expect(out).toHaveLength(input.length);
    expect(out.sort()).toEqual(input.sort());
  });

  it("is deterministic for a fixed rng", () => {
    const rng = mulberry32(7);
    expect(shuffle(rng, ["a", "b", "c"])).toEqual(shuffle(mulberry32(7), ["a", "b", "c"]));
  });
});

describe("pickOne", () => {
  it("returns an item from the array", () => {
    const items = ["x", "y", "z"];
    expect(items).toContain(pickOne(mulberry32(3), items));
  });

  it("returns the only item when the array has one element", () => {
    expect(pickOne(mulberry32(99), ["only"])).toBe("only");
    expect(pickOne(() => 0.999, ["only"])).toBe("only");
  });

  it("throws when the array is empty", () => {
    expect(() => pickOne(mulberry32(1), [])).toThrow(
      "pickOne: items must not be empty",
    );
  });
});
