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
const NUM_CUBES = 200;
const DIMS = {
  x: { min: -500, length: 1000 },
  y: { min: -500, length: 1000 }
};

const c = new Chance();

class Main extends AbstractApplication {
  constructor(){

    super();

    this._controls.enableZoom = true;
    this._camera.position.z = 700;
    this._boxes = [];

    var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    var geometry = new THREE.BoxGeometry( CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    var material2 = new THREE.ShaderMaterial({
        vertexShader: shaderVert,
        fragmentShader: shaderFrag
    });

    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(this._camera.position);
    this._scene.add(light);

    this._cubes = [];
    const thetaSlice = 360 / NUM_CUBES;

    for (let i = 0; i < NUM_CUBES; i++) {
      const mesh = new THREE.Mesh( geometry, material2 );

      const theta = thetaSlice * i;
      const p = Trig.getRadialPosition({ angle: theta, radius: DIMS.x.length * 0.4 });

      mesh.position.x = p.x;
      mesh.position.y = p.y;
      mesh.position.z = 0;

      this._boxes.push({
        position: mesh.position,
        theta,
        mesh,
        i,
        name: chance.name()
      });

      this._cubes.push(mesh);
       this._scene.add( mesh );
    }

    console.log(this._boxes);

    this.animate();

  }

}
export default Main;
