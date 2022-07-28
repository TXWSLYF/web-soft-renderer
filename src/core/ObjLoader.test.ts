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
});
