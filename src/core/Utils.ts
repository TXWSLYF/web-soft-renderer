import { mat4, vec3, vec4 } from "gl-matrix";
import Triangle from "./Triangle";

export const getModelMatrix = (rotationAngle: number): mat4 => {
  // 默认模型位于坐标原点，model 矩阵为单位矩阵
  // const model = this.getIdentityMatrix(4);
  const rotation = (rotationAngle * Math.PI) / 180;

  // 旋转矩阵，默认绕 z 轴旋转
  const rotate: mat4 = [
    Math.cos(rotation),
    -Math.sin(rotation),
    0,
    0,
    Math.sin(rotation),
    Math.cos(rotation),
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ];

  // return this.multiplyMatrices(rotate, model);
  return rotate;
};

export const getViewMatrix = (eyePos: vec3): mat4 => {
  return [
    1,
    0,
    0,
    -eyePos[0],
    0,
    1,
    0,
    -eyePos[1],
    0,
    0,
    1,
    -eyePos[2],
    0,
    0,
    0,
    1,
  ];
};

export const getProjectionMatrix = (
  eyeFov: number,
  aspectRatio: number,
  zNear: number,
  zFar: number
): mat4 => {
  const pertoorth: mat4 = [
    zNear,
    0,
    0,
    0,
    0,
    zNear,
    0,
    0,
    0,
    0,
    zNear + zFar,
    -(zNear * zFar),
    0,
    0,
    1,
    0,
  ];

  const halfEyeAngelRadian = (eyeFov / 2.0 / 180.0) * Math.PI;
  // zNear 一定是负的
  const t = -zNear * Math.tan(halfEyeAngelRadian); //top y轴的最高点
  const r = t * aspectRatio; //right x轴的最大值
  const l = -1 * r; //left x轴最小值
  const b = -1 * t; //bottom y轴的最大值

  const orth1: mat4 = [
    1,
    0,
    0,
    -(r + l) / 2,
    0,
    1,
    0,
    -(t + b) / 2,
    0,
    0,
    1,
    -(zNear + zFar) / 2,
    0,
    0,
    0,
    1,
  ];

  const orth2: mat4 = [
    2 / (r - l),
    0,
    0,
    0,
    0,
    2 / (t - b),
    0,
    0,
    0,
    0,
    2 / (zNear - zFar),
    0,
    0,
    0,
    0,
    1,
  ];

  const projection: mat4 = mat4.create();
  mat4.multiply(projection, pertoorth, orth1);
  mat4.multiply(projection, projection, orth2);

  return projection;
};

export const mat4MulVec4 = (matrix: mat4, vector: vec4): vec4 => {
  const a00 = matrix[0],
    a01 = matrix[1],
    a02 = matrix[2],
    a03 = matrix[3];
  const a10 = matrix[4],
    a11 = matrix[5],
    a12 = matrix[6],
    a13 = matrix[7];
  const a20 = matrix[8],
    a21 = matrix[9],
    a22 = matrix[10],
    a23 = matrix[11];
  const a30 = matrix[12],
    a31 = matrix[13],
    a32 = matrix[14],
    a33 = matrix[15];

  const b0 = vector[0],
    b1 = vector[1],
    b2 = vector[2],
    b3 = vector[3];

  const result0 = a00 * b0 + a01 * b1 + a02 * b2 + a03 * b3;
  const result1 = a10 * b0 + a11 * b1 + a12 * b2 + a13 * b3;
  const result2 = a20 * b0 + a21 * b1 + a22 * b2 + a23 * b3;
  const result3 = a30 * b0 + a31 * b1 + a32 * b2 + a33 * b3;

  return [result0, result1, result2, result3];
};

export const vectorA2B = (pointA: vec3, pointB: vec3): vec3 => {
  const vector: vec3 = vec3.create();

  for (let i = 0; i < 3; i++) {
    vector[i] = pointB[i] - pointA[i];
  }

  return vector;
};

export const insideTriangle = (x: number, y: number, t: Triangle): boolean => {
  const pointP: vec3 = [x, y, 1];
  const tPointA = t.v[0];
  const tPointB = t.v[1];
  const tPointC = t.v[2];

  const vectorAB = vectorA2B(tPointA, tPointB);
  const vectorAP = vectorA2B(tPointA, pointP);

  const vectorBC = vectorA2B(tPointB, tPointC);
  const vectorBP = vectorA2B(tPointB, pointP);

  const vectorCA = vectorA2B(tPointC, tPointA);
  const vectorCP = vectorA2B(tPointC, pointP);

  const crossProduct1 = vec3.create();
  const crossProduct2 = vec3.create();
  const crossProduct3 = vec3.create();

  vec3.cross(crossProduct1, vectorAB, vectorAP);
  vec3.cross(crossProduct2, vectorBC, vectorBP);
  vec3.cross(crossProduct3, vectorCA, vectorCP);

  const crossProduct1Z = crossProduct1[2];
  const crossProduct2Z = crossProduct2[2];
  const crossProduct3Z = crossProduct3[2];

  if (crossProduct1Z <= 0 && crossProduct2Z <= 0 && crossProduct3Z <= 0) {
    return true;
  }

  if (crossProduct1Z >= 0 && crossProduct2Z >= 0 && crossProduct3Z >= 0) {
    return true;
  }

  return false;
};

export const computeBarycentric2D = (
  x: number,
  y: number,
  v: vec3[]
): number[] => {
  const c1 =
    (x * (v[1][1] - v[2][1]) +
      (v[2][0] - v[1][0]) * y +
      v[1][0] * v[2][1] -
      v[2][0] * v[1][1]) /
    (v[0][0] * (v[1][1] - v[2][1]) +
      (v[2][0] - v[1][0]) * v[0][1] +
      v[1][0] * v[2][1] -
      v[2][0] * v[1][1]);
  const c2 =
    (x * (v[2][1] - v[0][1]) +
      (v[0][0] - v[2][0]) * y +
      v[2][0] * v[0][1] -
      v[0][0] * v[2][1]) /
    (v[1][0] * (v[2][1] - v[0][1]) +
      (v[0][0] - v[2][0]) * v[1][1] +
      v[2][0] * v[0][1] -
      v[0][0] * v[2][1]);
  const c3 =
    (x * (v[0][1] - v[1][1]) +
      (v[1][0] - v[0][0]) * y +
      v[0][0] * v[1][1] -
      v[1][0] * v[0][1]) /
    (v[2][0] * (v[0][1] - v[1][1]) +
      (v[1][0] - v[0][0]) * v[2][1] +
      v[0][0] * v[1][1] -
      v[1][0] * v[0][1]);

  return [c1, c2, c3];
};
