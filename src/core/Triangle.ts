import { vec2, vec3, vec4 } from "gl-matrix";

class Triangle {
  // the original coordinates of the triangle, v0, v1, v2 in counter clockwise order
  v: vec3[] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // color at each vertex;
  color: vec3[] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // texture u,v
  texCoords: vec2[] = [
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  // normal vector for each vertex
  normal: vec3[] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  a(): vec3 {
    return this.v[0];
  }

  b(): vec3 {
    return this.v[1];
  }

  c(): vec3 {
    return this.v[2];
  }

  /*set i-th vertex coordinates */
  setVertex(ind: number, ver: vec3) {
    this.v[ind] = ver;
  }

  /*set i-th vertex normal vector*/
  setNormal(ind: number, normal: vec3) {
    this.normal[ind] = normal;
  }

  /*set i-th vertex color*/
  setColor(ind: number, color: vec3) {
    this.color[ind] = color;
  }

  /*set i-th vertex texture coordinate*/
  setTexCoord(ind: number, texCoord: vec2) {
    this.texCoords[ind] = texCoord;
  }

  toVector4(): vec4[] {
    return [
      [this.v[0][0], this.v[0][1], this.v[0][2], 1],
      [this.v[1][0], this.v[1][1], this.v[1][2], 1],
      [this.v[2][0], this.v[2][1], this.v[2][2], 1],
    ];
  }
}

export default Triangle;
