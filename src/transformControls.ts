import { PerspectiveCamera, OrthographicCamera, Object3D, Vector3, Quaternion, TextureLoader,
  SpriteMaterial, Sprite, Texture, VertexColors, CatmullRomCurve3, Color, Vector2, Raycaster,
  SphereGeometry, MeshBasicMaterial, Mesh, CylinderGeometry, PlaneGeometry, DoubleSide,
  TorusGeometry, 
  PlaneBufferGeometry} from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Utils } from './utils';
import { ReplaySubject } from 'rxjs';
import { TransformControlsGizmo } from './TransformControlsGizmo';
import { TransformControlsPlane } from './TransformControlsPlane';

type TransformControlsMode = 'translate' | 'rotate' | 'scale';

export class TransformControls extends Object3D {

  public camera: PerspectiveCamera | OrthographicCamera;
  public domElement: HTMLElement;
  public raycaster: Raycaster = new Raycaster();
  public controls: OrbitControls;
  public dragging: boolean = false;
  private _gizmo: TransformControlsGizmo;
  private _plane: TransformControlsPlane;

  public mode: TransformControlsMode;
  public object: Object3D;
  public axis: 'X' | 'Y' | 'Z' | 'ZX' | 'YX' | 'ZY' | null;


  public cameraPosition: Vector3 = new Vector3();
  public cameraQuaternion: Quaternion;
  public cameraScale: Vector3;

  public worldPosition: Vector3 = new Vector3();
  public worldPositionStart: Vector3 = new Vector3();
  public worldPositionEnd: Vector3 = new Vector3();

  public worldQuaternion: Quaternion;
  public worldQuaternionStart: Quaternion;
  public worldQuaternionEnd: Quaternion;


  public pointStart: Vector3;
  public pointEnd: Vector3;
  public offset: Vector3;
  public positionStart: Vector3;
  public quaternionStart: Quaternion;
  public scaleStart: Vector3;

  public onChange$ = new ReplaySubject(1);
  public draggingChanged$ = new ReplaySubject(1);
  public draggingStop$ = new ReplaySubject(1);

  constructor(camera?: PerspectiveCamera | OrthographicCamera, domElement?: HTMLElement, orbitControls?: OrbitControls) {
    super();

    console.log({ camera, domElement });

    this.camera = camera;
    this.domElement = domElement;

    this._gizmo = new TransformControlsGizmo(camera, domElement);
    this.add(this._gizmo);

    this._plane = new TransformControlsPlane();
    this.add(this._plane);


    this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    this.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e), false);

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

  public onMouseDown(event: MouseEvent) {
    event.preventDefault();

    this.dragging = true;
    console.log(event);
    // console.log(this.domElement);

    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;

    const mouse = new Vector2();

    mouse.x = ( event.offsetX / width ) * 2 - 1;
    mouse.y = -( event.offsetY / height ) * 2 + 1;

    // Get 3D vector from 3D mouse position using 'unproject' function
    const vector = new Vector3(mouse.x, mouse.y, 1);


    this.raycaster.setFromCamera( mouse, this.camera );

    var intersects = this.raycaster.intersectObjects( this.children, true );
    const planeIntersect = this.raycaster.intersectObjects( [ this._plane ], true )[ 0 ] || false;
    console.log(planeIntersect);

    if ( planeIntersect === false ) return;

    this.offset.copy( this.pointEnd ).sub( this.pointStart );

    this.object.position.copy( this.offset ).add( this.positionStart );

    // console.log(this);

    if (intersects.length > 0) {
      console.log(intersects);
    }

    this.positionStart.copy( this.object.position );
    // console.log(vector);

    this.onChange$.next(true);
    this.draggingChanged$.next(true);
  }

  public onMouseMove(event: MouseEvent) {
    // console.log(e);

    if (this.dragging) {
      const width = this.domElement.clientWidth;
      const height = this.domElement.clientHeight;

      const mouse = new Vector2();

      mouse.x = ( event.offsetX / width ) * 2 - 1;
      mouse.y = -( event.offsetY / height ) * 2 + 1;

      const planeIntersect = this.raycaster.intersectObjects( [ this._plane ], true );
      console.log(this._plane);
      console.log(planeIntersect);

      // Get 3D vector from 3D mouse position using 'unproject' function
      const vector = new Vector3(mouse.x, mouse.y, 1);
      console.log(vector);
      this.onChange$.next(true);
      this.draggingChanged$.next(true);
    }

  }


  public onMouseUp(event: MouseEvent) {
    this.dragging = false;
    this.onChange$.next(true);
    this.draggingChanged$.next(true);
    this.draggingStop$.next(true);
  }

  // algo to convert the 2d to 3d
  // https://www.script-tutorials.com/webgl-with-three-js-lesson-10/
  public onmousedown(event: MouseEvent) {
    event.preventDefault();

    this.dragging = true;

    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;

    const mouse = new Vector2();

    mouse.x = ( event.offsetX / width ) * 2 - 1;
    mouse.y = -( event.offsetY / height ) * 2 + 1;
    // this._viewportService.mouseDownChange$.next({coords: this.mouse, event});

    // Get 3D vector from 3D mouse position using 'unproject' function
    const vector = new Vector3(mouse.x, mouse.y, 1);

    // Projects this vector from the camera's normalized device coordinate (NDC) space into world space.
    vector.unproject(this.camera);

    // Set the raycaster position
    this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );
    // Find all intersected objects
    const intersects = this.raycaster.intersectObjects([]);
    if (intersects.length > 0) {
      // Disable the controls
      this.controls.enabled = false;
      // Set the selection - first intersected object
      const selection = intersects[0].object;
      // Calculate the offset
      // const intersect = this.raycaster.intersectObject(this.plane);
      // this.offset.copy(intersects[0].point).sub(this.plane.position);
    }


  }


}

