declare module "three" {
  const Three: any;
  export = Three;
}

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  import type {
    AnimationClip,
    Group,
    Loader,
    LoadingManager,
    Object3D,
  } from "three";

  export interface GLTF {
    animations: AnimationClip[];
    scene: Group;
    scenes: Group[];
    parser: unknown;
    asset: {
      version: string;
      generator: string;
    };
  }

  export class GLTFLoader extends Loader<Group> {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: unknown) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: unknown) => void
    ): void;
    setDRACOLoader(loader: unknown): this;
  }
}

