export enum BufferType {
  Color = 1,
  Depth = 2,
}

class Rasterizer {
  width: number = 0;
  height: number = 0;

  // 帧缓存
  frameBuffer: number[][] = [];

  // 深度缓存
  depthBuffer: number[] = [];

  constructor(width: number, height: number) {
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
}

export default Rasterizer;
