import Matrix from "./Matrix";

test("Matrix getIdentityMatrix", () => {
  expect(Matrix.getIdentityMatrix(1)).toStrictEqual([[1]]);
  expect(Matrix.getIdentityMatrix(2)).toStrictEqual([
    [1, 0],
    [0, 1],
  ]);
  expect(Matrix.getIdentityMatrix(3)).toStrictEqual([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
});

test("Matrix vectorsDot", () => {
  const vectorA = [1, 2, 3];
  const vectorB = [1, 4, 3];

  expect(Matrix.vectorsDot(vectorA, vectorB)).toBe(18);
});

test("Matrix getCloumnFromMatrix", () => {
  const matrix = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ];

  expect(Matrix.getCloumnFromMatrix(matrix, 1)).toStrictEqual([2, 2, 2]);
});

test("Matrix multiplyMatrices", () => {
  const matrixA = [
    [1, 2, 3],
    [-1, 7, 4],
    [8, 4, 2],
  ];

  const matrixB = [
    [4, 8, -1],
    [2, 9, 2],
    [5, 4, 0],
  ];

  const matrixC = Matrix.getIdentityMatrix(4);
  const matrixD = [
    [1, 1, 2, 3],
    [1, 1, 2, 3],
    [11, -1, 2, 3],
    [1, 1, 2, 3],
  ];

  expect(Matrix.multiplyMatrices(matrixA, matrixB)).toStrictEqual([
    [23, 38, 3],
    [30, 71, 15],
    [50, 108, 0],
  ]);
  expect(Matrix.multiplyMatrices(matrixC, matrixD)).toStrictEqual(matrixD);
});

test("Matrix pointToMatrix", () => {
  const point = [1, 2, 3];

  expect(Matrix.pointToMatrix(point)).toStrictEqual([[1], [2], [3], [1]]);
  expect(Matrix.pointToMatrix(point, 3)).toStrictEqual([[1], [2], [3], [3]]);
});

test("Matrix matrixToPoint", () => {
  const point = [1, 2, 3];
  const matrix = Matrix.pointToMatrix(point, 3);

  expect(Matrix.matrixToPoint(matrix)).toStrictEqual([1 / 3, 2 / 3, 1]);
});

test("Matrix addMatrices", () => {
  const matrixA = [
    [1, 2, 3],
    [3, 2, 1],
  ];

  const matrixB = [
    [1, 2, 3],
    [3, 2, 1],
  ];

  expect(Matrix.addMatrices(matrixA, matrixB)).toStrictEqual([
    [2, 4, 6],
    [6, 4, 2],
  ]);
});

test("Matrix getRotationMatrix", () => {
  expect(Matrix.getRotationMatrix([1, 1, 1], 45)).toStrictEqual([
    [0.804737854124365, -0.31061721752604554, 0.5058793634016805, 0],
    [0.5058793634016805, 0.804737854124365, -0.31061721752604554, 0],
    [-0.31061721752604554, 0.5058793634016805, 0.804737854124365, 0],
    [0, 0, 0, 1],
  ]);
});
