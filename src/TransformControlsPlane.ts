import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";

export class TransformControlsPlane extends Object3D {

  constructor() {

    super();
    this.type = 'TransformControlsPlane';
    const plane = this.createPlane();
    this.add(plane);

  }

  public createPlane() {
    const geometry = new PlaneBufferGeometry( 100000, 100000, 2, 2 );
    const material = new MeshBasicMaterial( { visible: true, wireframe: true, side: DoubleSide, transparent: true, opacity: 0.8, color: 0x00ff00 } );
    const plane = new Mesh( geometry, material );
    return plane
  }

}