import { PerspectiveCamera, OrthographicCamera, Object3D, Vector3, Quaternion, TextureLoader,
  SpriteMaterial, Sprite, Texture, VertexColors, CatmullRomCurve3, Color, Vector2, Raycaster,
  SphereGeometry, MeshBasicMaterial, Mesh, CylinderGeometry } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Utils } from './utils';

type TransformControlsMode = 'translate' | 'rotate' | 'scale';

export class TransformControls extends Object3D {

  public camera: PerspectiveCamera | OrthographicCamera;
  public domElement: HTMLElement;
  public raycaster: Raycaster = new Raycaster();
  public controls: OrbitControls;
  public gizmo: TransformControlsGizmo;
  // public plane: TransformControlsPlane;

  public mode: TransformControlsMode;
  public object: Object3D;
  public axis: 'X' | 'Y' | 'Z' | 'ZX' | 'YX' | 'ZY' | null;

  public offset: any;

  public cameraPosition: Vector3 = new Vector3();
  public cameraQuaternion: Quaternion;
  public cameraScale: Vector3;

  public worldPosition: Vector3 = new Vector3();
  public worldPositionStart: Vector3 = new Vector3();
  public worldPositionEnd: Vector3 = new Vector3();

  public worldQuaternion: Quaternion;
  public worldQuaternionStart: Quaternion;
  public worldQuaternionEnd: Quaternion;

  constructor(camera?: PerspectiveCamera | OrthographicCamera, domElement?: HTMLElement) {
    super();

    console.log({ camera, domElement });

    this.camera = camera;
    this.domElement = domElement;

    this.gizmo = new TransformControlsGizmo(camera, domElement);
    this.add(this.gizmo);

  }

  public attach(object: Object3D) {

    this.object = object;
    this.visible = true;

    return this;

  }

  // Detach from object
  public detach () {

    this.object = undefined;
    this.visible = false;
    this.axis = null;

    return this;

  }


  public setMode(mode: TransformControlsMode) {

  }

  // algo to convert the 2d to 3d
  // https://www.script-tutorials.com/webgl-with-three-js-lesson-10/
  // public onmousedown(event: MouseEvent) {
  //   event.preventDefault();

  //   const width = this.domElement.clientWidth;
  //   const height = this.domElement.clientHeight;

  //   const mouse = new Vector2();

  //   mouse.x = ( event.offsetX / width ) * 2 - 1;
  //   mouse.y = -( event.offsetY / height ) * 2 + 1;
  //   // this._viewportService.mouseDownChange$.next({coords: this.mouse, event});

  //   // Get 3D vector from 3D mouse position using 'unproject' function
  //   const vector = new Vector3(mouse.x, mouse.y, 1);

  //   // Projects this vector from the camera's normalized device coordinate (NDC) space into world space.
  //   vector.unproject(this.camera);

  //   // Set the raycaster position
  //   this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
  //   // Find all intersected objects
  //   const intersects = this.raycaster.intersectObjects([]);
  //   if (intersects.length > 0) {
  //     // Disable the controls
  //     this.controls.enabled = false;
  //     // Set the selection - first intersected object
  //     const selection = intersects[0].object;
  //     // Calculate the offset
  //     // const intersect = this.raycaster.intersectObject(this.plane);
  //     // this.offset.copy(intersects[0].point).sub(this.plane.position);
  //   }


  // }


}

export class TransformControlsGizmo extends Object3D {

  public domElement: HTMLElement;
  public camera?: PerspectiveCamera | OrthographicCamera;

  constructor(camera?: PerspectiveCamera | OrthographicCamera, domElement?: HTMLElement) {

    super();

    this.domElement = domElement;
    this.camera = camera;

    console.log('TransformControlsGizmo init');

    // Add the center gizmo
    const sphere = this.createGizmo();
    this.add( sphere );


    /* ----------------------------- ADD THE ARROWS ----------------------------- */

    const x_arrow = this.createArrow(5, 100);
    x_arrow.name = 'arrow-x';
    x_arrow.position.set(0, 50, 0);
    this.add(x_arrow);



    // // create arrows
    // const x_arrow = this.createArrowWithFatLine(new Vector3(10, 0, 0), new Vector3(110, 0, 0), new Color(0xff0000));
    // x_arrow.name = 'arrow-x';

    // const y_arrow = this.createArrowWithFatLine(new Vector3(0, 10, 0), new Vector3(0, 110, 0), new Color(0x00ff00));
    // y_arrow.name = 'arrow-y';

    // const z_arrow = this.createArrowWithFatLine(new Vector3(0, 0, 10), new Vector3(0, 0, 110), new Color(0x0000ff));
    // z_arrow.name = 'arrow-z';
    
    // this.add(x_arrow, y_arrow, z_arrow);

  }

  public createGizmo() {
    var geometry = new SphereGeometry( 5, 32, 32 );
    var material = new MeshBasicMaterial( {color: 0x000000} );
    var sphere = new Mesh( geometry, material );
    sphere.name = 'sphere-center'
    return sphere;
  }


  public createArrow(radius = 5, height = 100) {
    // const radius = 5;
    // const height = 100;
    const radiusSegments = 32;
    const geometry = new CylinderGeometry( radius, radius, height, radiusSegments );
    const material = new MeshBasicMaterial( {color: 0xff0000} );
    const cylinder = new Mesh( geometry, material );
    return cylinder;
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

// export class TransformControlsPlane extends Object3D {

//   constructor() {

//     super();

//   }

// }


