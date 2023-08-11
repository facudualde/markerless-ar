import Gltf from './src/gltfHandler.js';
import './src/markerless-ar.js';

const box = new Gltf("box", -1, 0, -10, "./examples/box.gltf");
const DamagedHelmet = new Gltf("DamagedHelmet", 1, 0, -10, "./examples/DamagedHelmet.gltf");