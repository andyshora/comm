import * as THREE from 'three';
import _ from 'lodash';
import AbstractApplication from 'scripts/views/AbstractApplication';
import Trig from 'scripts/utils/trig.js';
import Chroma from 'chroma-js';
import Chance from 'chance';

const glslify = require('glslify');
const shaderVert = glslify('./../shaders/custom.vert');
const shaderFrag = glslify('./../shaders/custom.frag');

const CUBE_WIDTH = 2;
const CONE_RADIUS = 2;
const NUM_CUBES = 200;
const MAX_TIMER = 1000;
const SPEED = 10;
const DIMS = {
  x: { min: -500, length: 1000 },
  y: { min: -500, length: 1000 }
};
let timer = 0;

const c = new Chance();

class Main extends AbstractApplication {
  constructor(){

    super();

    this._controls.enableZoom = true;
    this._camera.position.z = 700;
    this._cubes = [];
    this._cones = [];

    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(this._camera.position);
    this._scene.add(light);

    this._addCubes();
    this._addCones();

    this.animate();

  }

  _addCones() {
    const thetaSlice = 360 / NUM_CUBES;

    var geometry = new THREE.ConeGeometry( CONE_RADIUS, CONE_RADIUS * 10, 8 );
    var material = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag
    });

    for (let i = 0; i < NUM_CUBES; i++) {
      const mesh = new THREE.Mesh( geometry, material );

      const theta = thetaSlice * i;
      const p = Trig.getRadialPosition({ angle: theta, radius: DIMS.x.length * 0.38 });

      mesh.position.x = p.x;
      mesh.position.y = p.y;
      mesh.position.z = 0;

      mesh.rotation.z = Trig.d2r(360 - (theta + 90));

      this._cones.push({
        i,
        mesh,
        name: chance.name(),
        position: mesh.position,
        theta
      });

      this._scene.add( mesh );
    }
  }

  _addCubes() {
    const thetaSlice = 360 / NUM_CUBES;

    var geometry = new THREE.CubeGeometry( CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH );
    var material = new THREE.ShaderMaterial({
        vertexShader: shaderVert,
        fragmentShader: shaderFrag
    });

    for (let i = 0; i < NUM_CUBES; i++) {
      const mesh = new THREE.Mesh( geometry, material );

      const theta = thetaSlice * i;
      const p = Trig.getRadialPosition({ angle: theta, radius: DIMS.x.length * 0.4 });

      mesh.position.x = p.x;
      mesh.position.y = p.y;
      mesh.position.z = 0;

      this._cubes.push({
        i,
        mesh,
        name: chance.name(),
        position: mesh.position,
        theta
      });

      this._scene.add( mesh );
    }
  }

  getCubePosition(i) {
    return this._cubes[i].position;
  }

  getRandomCube() {
    const index = chance.integer({min: 0, max: this._cubes.length - 1}); 
    return this._cubes[index];
  }

  animate(data) {
    super.animate();
    // console.log(timer);

    const progress = timer / MAX_TIMER;

    for (let i = 0; i < this._cones.length; i++) {
      const cone = this._cones[i];

      const radius = 0.4 * DIMS.x.length - (progress * 0.4 * DIMS.x.length);

      const p = Trig.getRadialPosition({ angle: cone.theta, radius: radius });

      this._cones[i].mesh.position.y = p.x;
      this._cones[i].mesh.position.x = p.y;
    }
    
    this._renderer.render(this._scene, this._camera);
    timer += SPEED;

    if (timer > MAX_TIMER) {
      timer = 0;
    }
  }


}
export default Main;
