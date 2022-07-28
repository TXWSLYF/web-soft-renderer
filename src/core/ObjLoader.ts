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

  // f v1[/vt1][/vn1] v2[/vt2][/vn2] v3[/vt3][/vn3] ...
  fArr.forEach((f) => {
    const t = new Triangle();

    f.forEach((v, index) => {
      const n = v.split("/").map((i) => Number(i));
      const position = vArr[n[0] - 1];
      t.setVertex(index, position);

      if (n[1]) {
        const vt = vtArr[n[1] - 1];
        t.setTexCoord(index, vt[0], vt[1]);
      }

      if (n[2]) {
        const vn = vnArr[n[2] - 1];
        t.setNormal(index, vn);
      }
    });

    triangles.push(t);
  });

  return triangles;
};
