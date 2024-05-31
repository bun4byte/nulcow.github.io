/* === IMPORTS === */

import * as THREE from 'three';

/* === PREVIEW HANDLER === */

const previewContainer = document.getElementById("previewImageContainer")

// Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, previewContainer.width / previewContainer.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( previewContainer.width, previewContainer.height );
previewContainer.appendChild( renderer.domElement );

// Create geometry
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

// Render loop
function animate() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );