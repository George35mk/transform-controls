import { PerspectiveCamera, OrthographicCamera, Object3D, Mesh, MeshBasicMaterial, SphereGeometry, CylinderGeometry, PlaneGeometry, DoubleSide, TorusGeometry, Texture, SpriteMaterial, Sprite, Vector3, Color, CatmullRomCurve3, VertexColors } from "three";
import { Utils } from "./utils";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { Line2 } from "three/examples/jsm/lines/Line2";

export class TransformControlsGizmo extends Object3D {

  public domElement: HTMLElement;
  public camera?: PerspectiveCamera | OrthographicCamera;

  public x_arrow: Mesh;
  public y_arrow: Mesh;
  public z_arrow: Mesh;

  public zx_plane: Mesh;
  public zy_plane: Mesh;
  public yx_plane: Mesh;

  public x_rotate: Mesh;
  public y_rotate: Mesh;
  public z_rotate: Mesh;

  // public centerMat = new SpriteMaterial({
  //   sizeAttenuation: false
  // })
  public redMat = new MeshBasicMaterial({ color: 0xff0000 });
  public greenMat = new MeshBasicMaterial({ color: 0x00ff00 });
  public blueMat = new MeshBasicMaterial({ color: 0x0000ff });

  constructor(camera?: PerspectiveCamera | OrthographicCamera, domElement?: HTMLElement) {

    super();

    this.domElement = domElement;
    this.camera = camera;

    this.type = 'TransformControlsGizmo'

    console.log('TransformControlsGizmo init');

    // Add the center gizmo
    const sphere = this.createGizmo();
    this.add( sphere );

    const arrowWidth = 100;
    const radius = 200;
    const area = 50;

    this.createPlaneMeshes(area);
    this.createArrowMeshes(arrowWidth);
    this.createRotationMeshes(radius);

  }

  public createGizmo() {
    var geometry = new SphereGeometry( 5, 32, 32 );
    var material = new MeshBasicMaterial( {color: 0xe91e63} );
    var sphere = new Mesh( geometry, material );
    sphere.name = 'sphere-center'
    return sphere;
  }


  public createArrow(radius = 5, height = 100, color: number) {
    // const radius = 5;
    // const height = 100;
    const radiusSegments = 32;
    const geometry = new CylinderGeometry( radius, radius, height, radiusSegments );
    geometry.computeBoundingBox();
    const material = new MeshBasicMaterial( {color: color || 0xff0000} );
    const cylinder = new Mesh( geometry, material );
    return cylinder;
  }

  public createPlane(width=50, height=50, color: number) {
    const geometry = new PlaneGeometry( width, height, 32 );
    const material = new MeshBasicMaterial( { color: color, side: DoubleSide } );
    const plane = new Mesh( geometry, material );
    return plane
  }

  public createTorus(radius=18, tube=0.5, color: number) {
    const radialSegments = 16;
    const tubularSegments = 100;
    const geometry = new TorusGeometry( radius, tube, radialSegments, tubularSegments );
    const material = new MeshBasicMaterial( { color: color || 0xffff00 } );
    const torus = new Mesh( geometry, material );
    return torus;
  }

  public createArrowMeshes(arrowWidth=100) {

    this.x_arrow = this.createArrow(5, arrowWidth, 0xff0000);
    this.x_arrow.name = 'arrow-x';
    this.x_arrow.position.set(70, 0, 0);
    Utils.rotateObject(this.x_arrow, 0, 0, 90)
    this.add(this.x_arrow);

    this.y_arrow = this.createArrow(5, arrowWidth, 0x00ff00);
    this.y_arrow.name = 'arrow-y';
    this.y_arrow.position.set(0, 70, 0);
    this.add(this.y_arrow);

    this.z_arrow = this.createArrow(5, arrowWidth, 0x0000ff);
    this.z_arrow.name = 'arrow-z';
    this.z_arrow.position.set(0, 0, 70);
    Utils.rotateObject(this.z_arrow, 90, 0, 0)
    this.add(this.z_arrow);

    this.add(this.x_arrow, this.y_arrow, this.z_arrow);

  }

  public createPlaneMeshes(area=50) {

    this.zx_plane = this.createPlane(area, area, 0xff00ff);
    this.zx_plane.name = 'plane-zx';
    this.zx_plane.position.set(40, 0, 40);
    Utils.rotateObject(this.zx_plane, 90, 0, 0)

    this.zy_plane = this.createPlane(area, area, 0x00ffff);
    this.zy_plane.name = 'plane-zy';
    this.zy_plane.position.set(0, 40, 40);
    Utils.rotateObject(this.zy_plane, 0, 90, 0)

    this.yx_plane = this.createPlane(area, area, 0xffff00);
    this.yx_plane.name = 'plane-yx';
    this.yx_plane.position.set(40, 40, 0);
    Utils.rotateObject(this.yx_plane, 0, 0, 90)

    this.add(this.zx_plane, this.zy_plane, this.yx_plane);

  }

  public createRotationMeshes(radius=100) {

    this.x_rotate = this.createTorus(radius, 1, 0xff0000);
    this.x_rotate.name = 'rotate-x';
    this.x_rotate.position.set(0, 0, 0);
    Utils.rotateObject(this.x_rotate, 0, 90, 0)
    this.add(this.x_rotate);

    this.y_rotate = this.createTorus(radius, 1, 0x00ff00);
    this.y_rotate.name = 'rotate-y';
    this.y_rotate.position.set(0, 0, 0);
    Utils.rotateObject(this.y_rotate, 90, 0, 0)
    this.add(this.y_rotate);

    this.z_rotate = this.createTorus(radius, 1, 0x000ff);
    this.z_rotate.name = 'rotate-z';
    this.z_rotate.position.set(0, 0, 0);
    Utils.rotateObject(this.z_rotate, 0, 0, 0)
    this.add(this.z_rotate);

  }


  public createArrow3() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = '#ffffff'; // CHANGED
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 10;
      ctx.moveTo(20, 20);
      ctx.lineTo(200, 20);
      ctx.stroke();
    }

    const spriteMap = new Texture(canvas);
    spriteMap.needsUpdate = true;

    // const spriteMap = new TextureLoader().load( "sprite.png" );
    const spriteMaterial = new SpriteMaterial( {
      map: spriteMap,
      color: 0xffffff,
      transparent: true,
    } );
    const sprite = new Sprite( spriteMaterial );
    sprite.position.set(0, 200, 0);
    sprite.scale.set(100, 100, 100);
    sprite.name = 'arrow sprite';
    sprite.up = new Vector3(0, 0, 1);
    const pos = this.camera.position;
    sprite.lookAt(0, 0, 0);
    // sprite.setRotationFromAxisAngle(new Vector3(1, 0, 0), 0);
    // sprite.rotateOnWorldAxis
    // scene.add( sprite );
    return sprite;
  }

  public createArrowWithFatLine(start: Vector3, end: Vector3, color: Color) {

    // const start = new Vector3(0, 0, 0);
    // const end = new Vector3(100, 0, 0);
    const points = [start, end];
    const spline = new CatmullRomCurve3( points, false );

    const divisions = 2;
    // const color = new Color();
    const positions: number[] | Float32Array = [];
    const colors = [];

    for ( let i = 0, l = divisions; i < l; i ++ ) {

      const point = spline.getPoint( i / l );
      positions.push( point.x, point.y, point.z );

      // color.setHSL( 0, 1.0, 0.5 );
      colors.push( color.r, color.g, color.b );

    }


    const geometry = new LineGeometry();
    geometry.setPositions( positions );
    geometry.setColors( colors );

    const matLine = new LineMaterial( {
      color: 0xffffff,
      linewidth: 5, // in pixels
      vertexColors: VertexColors,
      // resolution:  // to be set by renderer, eventually
      dashed: false
    });

    matLine.resolution.set(this.domElement.clientWidth, this.domElement.clientHeight);

    const line = new Line2( geometry, matLine );
    line.computeLineDistances();
    line.scale.set( 1, 1, 1 );
    line.position.set(0, 0, 0);
    line.name = 'arrow-line';
    return line;
  }


}