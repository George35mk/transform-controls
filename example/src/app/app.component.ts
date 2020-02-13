import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh,
  OrthographicCamera, PointLight, GridHelper, Color, MeshStandardMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls, Utils } from '../../../dist/index';
import { ReplaySubject } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  x = new ReplaySubject(0);

  public width: number;
  public height: number;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public cube: Mesh;
  /** The orbit controls. */
  public orbitControls: OrbitControls;
  public transformControls: TransformControls;

  /** The viewport element */
  @ViewChild('viewport') container: ElementRef;

  private _subs = new SubSink();

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.init3D();
    }, 50);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  init3D() {

    // get width and height
    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;

    // init scene
    this.scene = new Scene();
    this.scene.background = new Color('#fff');

    // init camera
    const fov = 35;
    const aspect = this.width / this.height;
    const near = 10; // with 0.1 I get z-fighting issues on zoom in-out
    const far = 8000;
    this.camera = new PerspectiveCamera( fov, aspect, near, far );
    this.camera.position.set(500, 500, 0);


    // init renderer
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize( this.width, this.height );
    this.container.nativeElement.appendChild( this.renderer.domElement );


    this.addGrid(this.scene);
    this.addLights(this.scene);
    this.render();


    // init orbit controls
    this.initOrbitControls(this.camera, this.renderer);
    this.render();

    // init transform controls
    this.initTransformControls(this.camera, this.renderer);
    this.render();




    console.log(this.scene);


    // add test object
    const geometry = new BoxGeometry(100, 100, 100);
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new Mesh( geometry, material );
    this.scene.add( this.cube );

    this.transformControls.attach(this.cube);

    this.render();




    /* ---------------------------------- test ---------------------------------- */
    // Utils.loadGLTF('assets/transform-controls-v10.glb').then( scene => {
    //   console.log(scene);
    //   const obj = scene.children[0];
    //   // const x = obj.toJSON();
    //   // console.log(JSON.stringify(x));

    //   obj.scale.set(1, 1, 1);
    //   this.scene.add(obj);

    //   console.log(this.scene);
    //   this.render();
    // });

    // this.render();
  }


  /**
   * Initialize the orbit controls.
   * @param camera the camera
   * @param renderer the renderer
   */
  public initOrbitControls(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, renderer: THREE.WebGLRenderer) {
    this.orbitControls = new OrbitControls(camera, renderer.domElement);
    this.orbitControls.autoRotate = false;
    this.orbitControls.enableZoom = true;
    this.orbitControls.enablePan = true;
    this.orbitControls.enableDamping = true; // the camera pans and orbit more smooth.
    this.orbitControls.dampingFactor = 0.45;
    this.orbitControls.rotateSpeed = 0.8;
    this.orbitControls.zoomSpeed = 1;
    this.orbitControls.maxDistance = 5000.0;
    this.orbitControls.screenSpacePanning = true; // the camera pans in screen space
    this.orbitControls.update();
    this.orbitControls.addEventListener( 'change', () => this.render() ); // use if there is no animation loop
  }


  public initTransformControls(camera: PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.transformControls = new TransformControls(camera, renderer.domElement);

    // disable orbit controls
    this._subs.sink =  this.transformControls.draggingChanged$.subscribe( res => {
      console.log('draggingChanged$');
      this.orbitControls.enabled = false;
      this.render();
    });

    // enable orbit controls
    this._subs.sink = this.transformControls.draggingStop$.subscribe( res => {
      console.log('draggingStop$');
      this.orbitControls.enabled = true;
      this.render();
    });

    console.log(this.transformControls);
    this.scene.add(this.transformControls);
  }


  public render() {
    this.renderer.render( this.scene, this.camera );
  }


  public onResize(event: UIEvent) {

    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;

    if (this.camera instanceof PerspectiveCamera) {

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( this.width, this.height );

    }

    if (this.camera instanceof OrthographicCamera) {

      this.renderer.setSize( this.width, this.height );

      const left   = this.width / -2;
      const right  = this.width / 2;
      const top    = this.height / 2;
      const bottom = this.height / -2;

      this.camera.left = left;
      this.camera.right = right;
      this.camera.top = top;
      this.camera.bottom = bottom;
      this.camera.updateProjectionMatrix();

    }

    this.renderer.render(this.scene, this.camera);

  }


  public addGrid(scene: Scene) {
    const grid = new GridHelper( 4000, 100);
    grid.position.set(0, 1, 0);
    grid.name = 'grid';
    scene.add( grid );
  }


  public addLights(scene: Scene) {
    const pointLight = new PointLight( 0xffffff, 1, 100 );
    pointLight.position.set( 0, 1000, 0 );
    scene.add( pointLight );
  }


}
