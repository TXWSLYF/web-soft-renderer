import Rasterizer, { BufferType } from "./Rasterizer";

test("Rasterizer init", () => {
  const rst = new Rasterizer(100, 100);
  expect(rst.frameBuffer.length).toBe(10000);
  expect(rst.depthBuffer.length).toBe(10000);
  expect(rst.frameBuffer[100]).toStrictEqual([0, 0, 0]);
  expect(rst.depthBuffer[100]).toStrictEqual(Infinity);
});

test("Rasterizer clear", () => {
  const rst = new Rasterizer(100, 100);

  rst.frameBuffer[100] = [100, 100, 100];
  rst.clear(BufferType.Color);
  expect(rst.frameBuffer[100]).toStrictEqual([0, 0, 0]);

  rst.depthBuffer[100] = 100;
  rst.clear(BufferType.Depth);
  expect(rst.depthBuffer[100]).toStrictEqual(Infinity);

  rst.frameBuffer[100] = [100, 100, 100];
  rst.depthBuffer[100] = 100;
  rst.clear(BufferType.Color | BufferType.Depth);
  expect(rst.frameBuffer[100]).toStrictEqual([0, 0, 0]);
  expect(rst.depthBuffer[100]).toStrictEqual(Infinity);
});
