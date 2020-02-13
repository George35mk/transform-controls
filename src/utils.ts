import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene, Object3D, Mesh, MathUtils } from 'three';


export class Utils {

  /** The GLTF loader. */
  public static gltfLoader = new GLTFLoader();

  constructor() { }

  public static loadGLTF(url: string) {
    return new Promise<Scene>( (resolve, reject) => {
      const onLoad = (gltf: GLTF) => {
        gltf.scene.scale.set(100, 100, 100); // scale here
        resolve(gltf.scene);
      };
      const onProgress = (progress: any) => { };
      const onError = (error: any) => { reject(error); };
      this.gltfLoader.load(url, onLoad, onProgress, onError);
    });
  }

  public static rotateObject(object: Object3D | Mesh, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(MathUtils.degToRad(degreeX));
    object.rotateY(MathUtils.degToRad(degreeY));
    object.rotateZ(MathUtils.degToRad(degreeZ));
  }

}
