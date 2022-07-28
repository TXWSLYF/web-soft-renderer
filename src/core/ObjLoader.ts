import Triangle from "./Triangle";

// https://all3dp.com/1/obj-file-format-3d-printing-cad/
export const objLoader = (objFileContent: string): Triangle[] => {
  const triangles: Triangle[] = [];
  const objFileContentArr = objFileContent.split("\n");

  const vArr = objFileContentArr
    .filter((i) => i.startsWith("v "))
    .map((v) => {
      const [, x, y, z] = v.split(" ");

      return [x, y, z].map((i) => Number(i));
    });
  const vtArr = objFileContentArr
    .filter((i) => i.startsWith("vt "))
    .map((vt) => {
      const [, u, v] = vt.split(" ");

      return [u, v].map((i) => Number(i));
    });
  const vnArr = objFileContentArr
    .filter((i) => i.startsWith("vn "))
    .map((vn) => {
      const [, x, y, z] = vn.split(" ");

      return [x, y, z].map((i) => Number(i));
    });
  const fArr = objFileContentArr
    .filter((i) => i.startsWith("f "))
    .map((f) => {
      const [, v1, v2, v3] = f.split(" ");

      return [v1, v2, v3];
    });

  fArr.forEach((f) => {
    const t = new Triangle();

    f.forEach((v, index) => {
      const n = v.split("/");
      const position = vArr[Number(n[0]) - 1];
      t.setVertex(index, position);
    });

    triangles.push(t);
  });

  return triangles;
};
