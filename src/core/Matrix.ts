export type Vector3 = [number, number, number];

// 4 维向量
export type Vector4 = [number, number, number, number];

// 4 * 4 矩阵
export type Matrix4 = [Vector4, Vector4, Vector4, Vector4];

class Matrix {
  static getIdentityMatrix(dimension: number): number[][] {
    const matrix = [];

    for (let i = 0; i < dimension; i++) {
      const row = [];

      for (let j = 0; j < dimension; j++) {
        row.push(j === i ? 1 : 0);
      }

      matrix.push(row);
    }

    return matrix;
  }

  static vectorsDot(vectorA: number[], vectorB: number[]) {
    if (vectorA.length !== vectorB.length) {
      throw new Error("length of vectorA must match length of vectorB");
    }

    let product = 0;
    for (let i = 0; i < vectorA.length; i++) {
      product += vectorA[i] * vectorB[i];
    }

    return product;
  }

  static getCloumnFromMatrix(matrix: number[][], i: number) {
    const columnCount = matrix[0].length;
    if (i > columnCount) {
      throw new Error("Insufficient number of matrix columns");
    }

    const rowCount = matrix.length;
    const column = [];
    for (let row = 0; row < rowCount; row++) {
      column.push(matrix[row][i]);
    }

    return column;
  }

  static multiplyMatrices(matrixA: number[][], matrixB: number[][]) {
    const rowA = matrixA.length;
    const columnA = matrixA[0].length;
    const rowB = matrixB.length;
    const columnB = matrixB[0].length;

    if (columnA !== rowB) {
      throw new Error("the row of matrixA doesn't match the column of matrixB");
    }

    const result = [];
    for (let i = 0; i < rowA; i++) {
      const row = [];
      for (let j = 0; j < columnB; j++) {
        const rowOfA = matrixA[i];
        const columnOfB = this.getCloumnFromMatrix(matrixB, j);
        row.push(this.vectorsDot(rowOfA, columnOfB));
      }
      result.push(row);
    }

    return result;
  }

  static multiplyMatrixWithNumber(matrix: number[][], n: number) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        matrix[i][j] = matrix[i][j] * n;
      }
    }

    return matrix;
  }

  static addMatrices(matrixA: number[][], matrixB: number[][]) {
    const result = [];
    const rowA = matrixA.length;
    const columnA = matrixA[0].length;
    const rowB = matrixB.length;
    const columnB = matrixB[0].length;

    if (rowA !== rowB || columnA !== columnB) {
      throw new Error("tow matirx must match if you want to add them!");
    }

    for (let i = 0; i < rowA; i++) {
      const row = [];
      for (let j = 0; j < columnB; j++) {
        row.push(matrixA[i][j] + matrixB[i][j]);
      }
      result.push(row);
    }

    return result;
  }

  static pointToMatrix(vector3: number[], w: number = 1) {
    return [[vector3[0]], [vector3[1]], [vector3[2]], [w]];
  }

  static matrixToPoint(matrix: number[][]) {
    Matrix.multiplyMatrixWithNumber(matrix, 1 / matrix[matrix.length - 1][0]);

    return [matrix[0][0], matrix[1][0], matrix[2][0]];
  }

  static getModelMatrix(rotationAngle: number): Matrix4 {
    // 默认模型位于坐标原点，model 矩阵为单位矩阵
    // const model = this.getIdentityMatrix(4);
    const rotation = (rotationAngle * Math.PI) / 180;

    // 旋转矩阵，默认绕 z 轴旋转
    const rotate: Matrix4 = [
      [Math.cos(rotation), -Math.sin(rotation), 0, 0],
      [Math.sin(rotation), Math.cos(rotation), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    // return this.multiplyMatrices(rotate, model);
    return rotate;
  }

  static getViewMatrix(eyePos: Vector3): number[][] {
    return [
      [1, 0, 0, -eyePos[0]],
      [0, 1, 0, -eyePos[1]],
      [0, 0, 1, -eyePos[2]],
      [0, 0, 0, 1],
    ];
  }

  static getProjectionMatrix(
    eyeFov: number,
    aspectRatio: number,
    zNear: number,
    zFar: number
  ) {
    const pertoorth = [
      [zNear, 0, 0, 0],
      [0, zNear, 0, 0],
      [0, 0, zNear + zFar, -(zNear * zFar)],
      [0, 0, 1, 0],
    ];

    const halfEyeAngelRadian = (eyeFov / 2.0 / 180.0) * Math.PI;
    // zNear 一定是负的
    const t = -zNear * Math.tan(halfEyeAngelRadian); //top y轴的最高点
    const r = t * aspectRatio; //right x轴的最大值
    const l = -1 * r; //left x轴最小值
    const b = -1 * t; //bottom y轴的最大值

    const orth1 = [
      [1, 0, 0, -(r + l) / 2],
      [0, 1, 0, -(t + b) / 2],
      [0, 0, 1, -(zNear + zFar) / 2],
      [0, 0, 0, 1],
    ];

    const orth2 = [
      [2 / (r - l), 0, 0, 0],
      [0, 2 / (t - b), 0, 0],
      [0, 0, 2 / (zNear - zFar), 0],
      [0, 0, 0, 1],
    ];

    const projection = Matrix.multiplyMatrices(
      Matrix.multiplyMatrices(orth2, orth1),
      pertoorth
    );

    return projection;
  }

  /**
   * @description 计算绕任意过原点的轴的旋转变换矩阵
   * @param axis 过原点向量
   * @param angle 旋转角度
   * 罗德里格斯旋转公式矩阵表示
   * https://baike.baidu.com/item/%E7%BD%97%E5%BE%B7%E9%87%8C%E6%A0%BC%E6%97%8B%E8%BD%AC%E5%85%AC%E5%BC%8F/18878562?fr=aladdin#3
   */
  static getRotationMatrix(axis: number[], angle: number) {
    const rotation = (angle * Math.PI) / 180;
    const axisLength = Math.sqrt(
      Math.pow(axis[0], 2) + Math.pow(axis[1], 2) + Math.pow(axis[2], 2)
    );

    const axis1 = [];
    for (let i = 0; i < axis.length; i++) {
      axis1[i] = (1 / axisLength) * axis[i];
    }

    const mat2 = Matrix.getIdentityMatrix(3);
    const mat3 = [
      [0, -axis1[2], axis1[1]],
      [axis1[2], 0, -axis1[0]],
      [-axis1[1], axis1[0], 0],
    ];

    const matrixAxis1 = [[axis1[0]], [axis1[1]], [axis1[2]]];
    const matrixAxis1Transpose = [[axis1[0], axis1[1], axis1[2]]];

    const temp1 = Matrix.multiplyMatrixWithNumber(mat2, Math.cos(rotation));
    const temp2 = Matrix.multiplyMatrixWithNumber(
      Matrix.multiplyMatrices(matrixAxis1, matrixAxis1Transpose),
      1 - Math.cos(rotation)
    );
    const temp3 = Matrix.multiplyMatrixWithNumber(mat3, Math.sin(rotation));

    const mat1 = Matrix.addMatrices(Matrix.addMatrices(temp1, temp2), temp3);

    const rotateMartix = [
      [...mat1[0], 0],
      [...mat1[1], 0],
      [...mat1[2], 0],
      [0, 0, 0, 1],
    ]

    return rotateMartix
  }
}

export default Matrix;
