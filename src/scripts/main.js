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
const CONES_PER_CONNECTION = 5;
const NUM_CUBES = 180;
const MAX_TIMER = 1000;
const SPEED = 20;
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
    this._camera.position.z = 800;
    this._cubes = [];
    this._cones = _.times(CONES_PER_CONNECTION, () => []);

    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(this._camera.position);
    this._scene.add(light);

    this._addCubes();

    for (let j = 0; j < CONES_PER_CONNECTION; j++) {
      this._addCones(j);
    }
    // this._moveCone({ index: 0, towardsIndex: 90, scale: 0.8 });
    this._createRelationships();

    this.animate();

  }

  _moveCone({ groupIndex, index, towardsIndex, scale }) {
    const posA = this._cubes[index].position.clone();
    const posB = this._cubes[towardsIndex].position.clone();

    const distance = posA.distanceTo(posB);

    let v = posB.sub(posA).normalize().setLength(distance * scale);
    
    this._cones[groupIndex][index].mesh.position.x = posA.x + v.x;
    this._cones[groupIndex][index].mesh.position.y = posA.y + v.y;
  }

  _addCones(groupIndex) {
    const thetaSlice = 360 / NUM_CUBES;

    var geometry = new THREE.CircleGeometry( CONE_RADIUS, 8 );//THREE.ConeGeometry( CONE_RADIUS, CONE_RADIUS * 10, 8 );
    var material = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag
    });

    for (let i = 0; i < NUM_CUBES; i++) {
      const mesh = new THREE.Mesh( geometry, material );

      const scaleFactor = 0.4;

      const theta = thetaSlice * i;
      const p = Trig.getRadialPosition({ angle: theta, radius: DIMS.x.length * scaleFactor });

      mesh.position.x = p.x;
      mesh.position.y = p.y;
      mesh.position.z = 0;

      mesh.rotation.z = Trig.d2r(360 - (theta + 90));

      this._cones[groupIndex].push({
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

  _getCubePosition(i) {
    return this._cubes[i].position;
  }

  _getRandomCube() {
    const index = chance.integer({ min: 0, max: this._cubes.length - 1 }); 
    return this._cubes[index];
  }

  _createRelationships() {
    for (let i = 0; i < this._cubes.length; i++) {
      const targetIndex = this._getRandomCube().i
      this._cones[0][i].target = targetIndex;
    }
  }

  animate(data) {
    super.animate();

    const progress = timer / MAX_TIMER;

    for (let i = 0; i < this._cubes.length; i++) {
      if (i % 10 === 0) {
        const target = this._cones[0][i].target;
        for (let j = 0; j < CONES_PER_CONNECTION; j++) {
          this._moveCone({ groupIndex: j, index: i, towardsIndex: target, scale: Math.max(progress - (j * 0.2 / CONES_PER_CONNECTION), 0) });
        }
      }
      
    }
    // this._moveCone({ index: 0, towardsIndex: this._cones[0].target, scale: progress });
    // this._moveCone({ index: 1, towardsIndex: this._cones[1].target, scale: progress });
    
    this._renderer.render(this._scene, this._camera);
    timer += SPEED;

    if (timer > MAX_TIMER) {
      timer = 0;
    }
  }


}
export default Main;
