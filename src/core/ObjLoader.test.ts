import { readFileSync } from "fs";
import path from "path";
import { objLoader } from "./ObjLoader";

test("objLoader", async () => {
  const objFileContent = await readFileSync(
    path.resolve(__dirname, "../models/cube/cube.obj")
  ).toString();

  const triangles = objLoader(objFileContent);

  const t1 = triangles[1];
  const t5 = triangles[5];

  expect(t1.a()).toStrictEqual([1, 1, -1]);
  expect(t1.b()).toStrictEqual([-1, -1, -1]);
  expect(t1.c()).toStrictEqual([-1, 1, -1]);

  expect(t5.a()).toStrictEqual([0.999999, 1, 1.000001]);
  expect(t5.b()).toStrictEqual([-1.0, 1.0, 1.0]);
  expect(t5.c()).toStrictEqual([-1.0, -1.0, 1.0]);

  expect(t1.texCoords).toStrictEqual([
    [0.748573, 0.750412],
    [0.99911, 0.501077],
    [0.999455, 0.75038],
  ]);
  expect(t1.normal).toStrictEqual([
    [0.0, 0.0, -1.0],
    [0.0, 0.0, -1.0],
    [0.0, 0.0, -1.0],
  ]);

  expect(t5.texCoords).toStrictEqual([
    [0.500149, 0.750166],
    [0.249682, 0.749677],
    [0.250471, 0.500702],
  ]);
  expect(t5.normal).toStrictEqual([
    [-0.000001, 0.0, 1.0],
    [-0.000001, 0.0, 1.0],
    [-0.000001, 0.0, 1.0],
  ]);
});
