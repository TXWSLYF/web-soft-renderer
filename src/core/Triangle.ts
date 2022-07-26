class Triangle {
  // the original coordinates of the triangle, v0, v1, v2 in counter clockwise order
  v: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // color at each vertex;
  color: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // texture u,v
  texCoords: number[][] = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  // normal vector for each vertex
  normal: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  a(): number[] {
    return this.v[0];
  }
  b(): number[] {
    return this.v[1];
  }
  c(): number[] {
    return this.v[2];
  }

  /*set i-th vertex coordinates */
  setVertex(ind: number, ver: number[]) {
    this.v[ind] = ver;
  }

  /*set i-th vertex normal vector*/
  setNormal(ind: number, n: number[]) {
    this.normal[ind] = n;
  }

  /*set i-th vertex color*/
  setColor(ind: number, r: number, g: number, b: number) {
    this.color[ind] = [r, g, b];
  }

  /*set i-th vertex texture coordinate*/
  setTexCoord(ind: number, s: number, t: number) {
    this.texCoords[ind] = [s, t];
  }

  toVector4(): number[][] {
    return [
      [this.v[0][0], this.v[0][1], this.v[0][2], 1],
      [this.v[1][0], this.v[1][1], this.v[1][2], 1],
      [this.v[2][0], this.v[2][1], this.v[2][2], 1],
    ];
  }
}

export default Triangle;
