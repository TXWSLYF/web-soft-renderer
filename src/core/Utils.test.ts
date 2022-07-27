import Triangle from "./Triangle";
import { crossProductOfTwoVector, insideTriangle, vectorA2B } from "./Utils";

test("Utils vectorA2B", () => {
  const pointA = [1, 1, 2];
  const pointB = [4, 3, 10];

  expect(vectorA2B(pointA, pointB)).toStrictEqual([3, 2, 8]);
});

test("Utils crossProductOfTwoVector", () => {
  const vectorA = [1, 2, 3];
  const vectorB = [4, 6, 5];

  expect(crossProductOfTwoVector(vectorA, vectorB)).toStrictEqual([-8, 7, -2]);
});

test("Utils insideTriangle", () => {
  const t = new Triangle();
  t.setVertex(0, [0, 1, 1]);
  t.setVertex(1, [1, 1, 1]);
  t.setVertex(2, [1, 0, 1]);

  expect(insideTriangle(0, 0, t)).toBe(false);
  expect(insideTriangle(1 / 2, 2 / 3, t)).toBe(true);
  expect(insideTriangle(1 / 2, 1 / 2, t)).toBe(true);
});
