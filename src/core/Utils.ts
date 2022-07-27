import Triangle from "./Triangle";

export const vectorA2B = (pointA: number[], pointB: number[]): number[] => {
  const vector: number[] = [];

  for (let i = 0; i < 3; i++) {
    vector.push(pointB[i] - pointA[i]);
  }

  return vector;
};

export const crossProductOfTwoVector = (
  vectorA: number[],
  vectorB: number[]
): number[] => {
  const [xa, ya, za] = vectorA;
  const [xb, yb, zb] = vectorB;

  return [ya * zb - yb * za, za * xb - xa * zb, xa * yb - ya * xb];
};

export const insideTriangle = (x: number, y: number, t: Triangle): boolean => {
  const pointP = [x, y, 1];
  const tPointA = t.v[0];
  const tPointB = t.v[1];
  const tPointC = t.v[2];

  const vectorAB = vectorA2B(tPointA, tPointB);
  const vectorAP = vectorA2B(tPointA, pointP);

  const vectorBC = vectorA2B(tPointB, tPointC);
  const vectorBP = vectorA2B(tPointB, pointP);

  const vectorCA = vectorA2B(tPointC, tPointA);
  const vectorCP = vectorA2B(tPointC, pointP);

  const crossProduct1Z = crossProductOfTwoVector(vectorAB, vectorAP)[2];
  const crossProduct2Z = crossProductOfTwoVector(vectorBC, vectorBP)[2];
  const crossProduct3Z = crossProductOfTwoVector(vectorCA, vectorCP)[2];

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
  v: number[][]
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
