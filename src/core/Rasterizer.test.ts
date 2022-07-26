import Rasterizer, { BufferType } from "./Rasterizer";

test("Rasterizer init", () => {
  const rst = new Rasterizer();
  rst.init(100, 100);
  
  expect(rst.frameBuffer.length).toBe(10000);
  expect(rst.depthBuffer.length).toBe(10000);
  expect(rst.frameBuffer[100]).toStrictEqual([0, 0, 0]);
  expect(rst.depthBuffer[100]).toStrictEqual(Infinity);
});

test("Rasterizer clear", () => {
  const rst = new Rasterizer();
  rst.init(100, 100);

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

test("Rasterizer load pos and ind", () => {
  const rst = new Rasterizer();
  rst.init(100, 100);

  const posId = rst.loadPositions([
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
  ]);
  const indId = rst.loadIndices([[0, 1, 2]]);

  expect(posId).toBe(0);
  expect(indId).toBe(1);
  expect(rst.nextId).toBe(2);
  expect(rst.posBuffer[posId]).toStrictEqual([
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
  ]);
  expect(rst.indBuffer[indId]).toStrictEqual([[0, 1, 2]]);
});
