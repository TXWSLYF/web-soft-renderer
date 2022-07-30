import { mat4, vec3, vec4 } from "gl-matrix";
import { objLoader } from "./ObjLoader";
import Triangle from "./Triangle";
import { computeBarycentric2D, insideTriangle, mat4MulVec4 } from "./Utils";

export enum BufferType {
  Color = 1,
  Depth = 2,
}

export enum Primitive {
  Line,
  Triangle,
}

class Rasterizer {
  width: number = 0;
  height: number = 0;

  // 帧缓存
  frameBuffer: vec3[] = [];

  // 深度缓存
  depthBuffer: number[] = [];

  nextId = 0;

  // 顶点数据
  posBuffer: {
    [key: string]: vec3[];
  } = {};

  // 索引数据
  indBuffer: {
    [key: string]: vec3[];
  } = {};

  // 顶点颜色数据
  colBuffer: {
    [key: string]: vec3[];
  } = {};

  // 模型变换矩阵
  model: mat4 = mat4.create();

  // 视图变换矩阵
  view: mat4 = mat4.create();

  // 投影矩阵
  projection: mat4 = mat4.create();

  init(width: number, height: number) {
    this.width = width;
    this.height = height;
    const product = width * height;

    for (let i = 0; i < product; i++) {
      this.frameBuffer.push([0, 0, 0]);
      this.depthBuffer.push(Infinity);
    }
  }

  clear(buffetType: BufferType) {
    if ((buffetType & BufferType.Color) === BufferType.Color) {
      for (let i = 0; i < this.frameBuffer.length; i++) {
        this.frameBuffer[i] = [0, 0, 0];
      }
    }

    if ((buffetType & BufferType.Depth) === BufferType.Depth) {
      for (let i = 0; i < this.depthBuffer.length; i++) {
        this.depthBuffer[i] = Infinity;
      }
    }
  }

  getNextId() {
    return this.nextId++;
  }

  loadPositions(pos: vec3[]) {
    const nextId = this.getNextId();
    this.posBuffer[nextId] = pos;

    return nextId;
  }

  loadIndices(ind: vec3[]) {
    const nextId = this.getNextId();
    this.indBuffer[nextId] = ind;

    return nextId;
  }

  loadColors(cols: vec3[]) {
    const nextId = this.getNextId();
    this.colBuffer[nextId] = cols;

    return nextId;
  }

  setModel(model: mat4) {
    this.model = model;
  }

  setView(view: mat4) {
    this.view = view;
  }

  setProjection(projection: mat4) {
    this.projection = projection;
  }

  getMvp(): mat4 {
    const { model, view, projection } = this;

    const mvp = mat4.create();
    mat4.mul(mvp, model, view);
    mat4.mul(mvp, mvp, projection);

    return mvp;
  }

  draw(
    posBufferId: number,
    indBufferId: number,
    colBufferId: number,
    type: Primitive
  ) {
    if (type !== Primitive.Triangle) {
      throw new Error(
        "Drawing primitives other than triangle is not implemented yet!"
      );
    }

    const f1 = (100 - 0.1) / 2.0;
    const f2 = (100 + 0.1) / 2.0;
    const mvp = this.getMvp();

    const positions = this.posBuffer[posBufferId];
    const indexs = this.indBuffer[indBufferId];
    const colors = this.colBuffer[colBufferId];

    indexs.forEach((index) => {
      const t = new Triangle();
      let v: vec4[] = [
        mat4MulVec4(mvp, [
          positions[index[0]][0],
          positions[index[0]][1],
          positions[index[0]][2],
          1,
        ]),
        mat4MulVec4(mvp, [
          positions[index[1]][0],
          positions[index[1]][1],
          positions[index[1]][2],
          1,
        ]),
        mat4MulVec4(mvp, [
          positions[index[2]][0],
          positions[index[2]][1],
          positions[index[2]][2],
          1,
        ]),
      ];

      v.forEach((point) => {
        vec4.scale(point, point, 1 / point[3]);
      });

      v.forEach((point) => {
        point[0] = 0.5 * this.width * (point[0] + 1.0);
        point[1] = 0.5 * this.height * (point[1] + 1.0);
        point[2] = point[2] * f1 + f2;
      });

      for (let i = 0; i < 3; i++) {
        t.setVertex(i, [v[i][0], v[i][1], v[i][2]]);
      }

      t.setColor(0, [
        colors[index[0]][0],
        colors[index[0]][1],
        colors[index[0]][2],
      ]);
      t.setColor(1, [
        colors[index[1]][0],
        colors[index[1]][1],
        colors[index[1]][2],
      ]);
      t.setColor(2, [
        colors[index[2]][0],
        colors[index[2]][1],
        colors[index[2]][2],
      ]);

      // this.rasterizeWireframe(t);
      this.rasterizeTriangle(t);
    });
  }

  drawObj(objFileContent: string) {
    const triangleList = objLoader(objFileContent);

    const f1 = (100 - 0.1) / 2.0;
    const f2 = (100 + 0.1) / 2.0;
    const mvp = this.getMvp();

    triangleList.forEach((oldT) => {
      const t = new Triangle();
      let v: vec4[] = [
        mat4MulVec4(mvp, [oldT.a()[0], oldT.a()[1], oldT.a()[2], 1]),
        mat4MulVec4(mvp, [oldT.b()[0], oldT.b()[1], oldT.b()[2], 1]),
        mat4MulVec4(mvp, [oldT.c()[0], oldT.c()[1], oldT.c()[2], 1]),
      ];

      v.forEach((point) => {
        vec4.scale(point, point, 1 / point[3]);
      });

      v.forEach((point) => {
        point[0] = 0.5 * this.width * (point[0] + 1.0);
        point[1] = 0.5 * this.height * (point[1] + 1.0);
        point[2] = point[2] * f1 + f2;
      });

      for (let i = 0; i < 3; i++) {
        t.setVertex(i, [v[i][0], v[i][1], v[i][2]]);
      }

      t.setColor(0, [148, 121.0, 92.0]);
      t.setColor(1, [148, 121.0, 92.0]);
      t.setColor(2, [148, 121.0, 92.0]);

      this.rasterizeWireframe(t);
      // this.rasterizeTriangle(t);
    });
  }

  rasterizeTriangle(t: Triangle) {
    const v0 = t.v[0];
    const v1 = t.v[1];
    const v2 = t.v[2];

    // 第一步：找到三角形的 2 维 bounding box
    let max_x = Math.max(v0[0], Math.max(v1[0], v2[0]));
    let min_x = Math.min(v0[0], Math.min(v1[0], v2[0]));
    let max_y = Math.max(v0[1], Math.max(v1[1], v2[1]));
    let min_y = Math.min(v0[1], Math.min(v1[1], v2[1]));

    max_x = Math.trunc(max_x);
    max_y = Math.trunc(max_y);
    min_x = Math.trunc(min_x);
    min_y = Math.trunc(min_y);

    // 第二步：遍历 bounding box 内的所有像素，然后使用像素中 心的屏幕空间坐标来检查中心点是否在三角形内。
    for (let x = min_x; x <= max_x; x++) {
      for (let y = min_y; y <= max_y; y++) {
        if (insideTriangle(x + 0.5, y + 0.5, t)) {
          const [c1, c2, c3] = computeBarycentric2D(x + 0.5, y + 0.5, t.v);

          // 计算采样点深度插值
          const z = c1 * t.v[0][2] + c2 * t.v[1][2] + c3 * t.v[2][2];

          if (z < this.depthBuffer[this.getIndex(x, y)]) {
            const color1 = t.color[0];
            const color2 = t.color[1];
            const color3 = t.color[2];

            // 计算颜色插值
            const color: vec3 = [
              c1 * color1[0] + c2 * color2[0] + c3 * color3[0],
              c1 * color1[1] + c2 * color2[1] + c3 * color3[1],
              c1 * color1[2] + c2 * color2[2] + c3 * color3[2],
            ];

            this.setPixel([x, y, 1], color);
            this.depthBuffer[this.getIndex(x, y)] = z;
          }
        }
      }
    }
  }

  rasterizeWireframe(t: Triangle) {
    this.drawLine(t.c(), t.a());
    this.drawLine(t.c(), t.b());
    this.drawLine(t.b(), t.a());
  }

  drawLine(begin: vec3, end: vec3) {
    const x1 = Math.trunc(begin[0]);
    const y1 = Math.trunc(begin[1]);
    const x2 = Math.trunc(end[0]);
    const y2 = Math.trunc(end[1]);

    const lineColor: vec3 = [255, 255, 255];
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;

    dx = x2 - x1;
    dy = y2 - y1;

    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;

    if (dy1 < dx1) {
      if (dx >= 0) {
        x = x1;
        y = y1;
        xe = x2;
      } else {
        x = x2;
        y = y2;
        xe = x1;
      }

      this.setPixel([x, y], lineColor);
      for (i = 0; x < xe; i++) {
        x = x + 1;
        if (px < 0) {
          px = px + 2 * dy1;
        } else {
          if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
            y = y + 1;
          } else {
            y = y - 1;
          }
          px = px + 2 * (dy1 - dx1);
        }
        this.setPixel([x, y], lineColor);
      }
    } else {
      if (dy >= 0) {
        x = x1;
        y = y1;
        ye = y2;
      } else {
        x = x2;
        y = y2;
        ye = y1;
      }
      this.setPixel([x, y], lineColor);
      for (i = 0; y < ye; i++) {
        y = y + 1;
        if (py <= 0) {
          py = py + 2 * dx1;
        } else {
          if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
            x = x + 1;
          } else {
            x = x - 1;
          }
          py = py + 2 * (dx1 - dy1);
        }
        this.setPixel([x, y], lineColor);
      }
    }
  }

  setPixel(point: number[], color: vec3) {
    if (
      point[0] < 0 ||
      point[0] >= this.width ||
      point[1] < 0 ||
      point[1] >= this.height
    ) {
      return;
    }

    const ind = (this.height - point[1]) * this.width + point[0];
    this.frameBuffer[ind] = color;
  }

  getIndex(x: number, y: number) {
    return (this.height - 1 - y) * this.width + x;
  }
}

export default Rasterizer;
