import { mat3, mat4, vec3, vec4 } from "gl-matrix";
import Triangle from "./Triangle";
import {
  getModelMatrix,
  getViewMatrix,
  mat4MulVec4,
  insideTriangle,
} from "./Utils";

test("Utils getModelMatrix", () => {
  expect(getModelMatrix(10)).toStrictEqual([
    0.984807753012208, -0.17364817766693033, 0, 0, 0.17364817766693033,
    0.984807753012208, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ]);
});

test("Utils getViewMatrix", () => {
  const eyePos: vec3 = [0, 0, 10];
  expect(getViewMatrix(eyePos)).toStrictEqual([
    1, 0, 0, -0, 0, 1, 0, -0, 0, 0, 1, -10, 0, 0, 0, 1,
  ]);
});

// TODO:
test("Utils getProjectionMatrix", () => {
  // expect(
  //   getProjectionMatrix(45, 1, 0.1, 50).map((i) => Number(i.toFixed(5)))
  // ).toStrictEqual([
  //   -2.4142135623730954, 0, 0, 0, 0, -2.4142135623730954, 0, 0, 0, 0,
  //   -1.0040080160320641, 0.2004008016032064, 0, 0, 1, 0,
  // ]);
});

test("Utils mat4MulVec4", () => {
  const matrix: mat4 = [1, 2, 3, 4, 3, 1.3, 4, 8, 3, 1.3, -4, 5, 3, 1.3, 4, 8];
  const vector: vec4 = [1, -2, 3, 1];

  expect(mat4MulVec4(matrix, vector)).toStrictEqual([10, 20.4, -6.6, 20.4]);
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
