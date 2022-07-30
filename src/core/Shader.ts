import { vec2, vec3 } from "gl-matrix";

export type FragmentShaderPayload = {
  viewPos: vec3;
  color: vec3;
  normal: vec3;
  texCoords: vec2;
};

export type FragmentShader = (payload: FragmentShaderPayload) => vec3;

export const normalFragmentShader: FragmentShader = ({ normal }) => {
  const result = vec3.create();

  vec3.add(result, normal, [1, 1, 1]);
  vec3.scale(result, result, 0.5 * 255);

  return result;
};
