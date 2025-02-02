import * as THREE from 'three';
import * as body from './body';
import { PhysicsFrame } from './physicsframe';
import { Resources } from './resources';

// get the canvas
const canvas = document.getElementById("canvas")! as HTMLCanvasElement
// Initialize the GL context
const gl = canvas.getContext("webgl2");
// Show a warning if WebGL is not available
if (!gl) {
  document.getElementById("webgl-warning")!.hidden = false;
  canvas.hidden = true
}
const startButton = document.getElementById("start-button")! as HTMLButtonElement
const spinner = document.getElementById("spinner")! as HTMLSpanElement

const gInput = document.getElementById("G")! as HTMLInputElement

export const resources = new Resources(
	() => {
		startButton.disabled = false;
		spinner.hidden = true;
	},
	s => {
		showError(`failed to load resource ${s}`);
	}
);

const scene = new THREE.Scene();
const physics = new PhysicsFrame(0.00005);

gInput.onchange = (ev) => {
	console.log(`updating G to ${gInput.valueAsNumber}`)
	physics.gravitationalConstant = gInput.valueAsNumber;
}

const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: gl!, antialias: true } );

const width = canvas.width, height = canvas.height;


function start() {
	try {
		renderer.shadowMap.enabled = true
		const camera = new THREE.PerspectiveCamera( 75, width / height, 0.01, 2000);
		camera.position.z = 8;
		camera.position.y = 3;
		
		scene.background = new THREE.Color('#030504')
		
		const light = new THREE.AmbientLight( 0x333333 ); // soft white light
		scene.add( light );

		// adding a virtual sun using directional light
		const dirLight = new THREE.DirectionalLight(0xffffee, 0.8)
		dirLight.castShadow = true;
		dirLight.position.set(-50, 0, 30)
		scene.add(dirLight);
	
		physics.add(
			body.makeMoon({
			}),
			body.makeMoon({
				color: 0xffbbbb, 
				radius: 0.275,
				startingPosition: new THREE.Vector3(8, 0, 0), 
				initialVelocity: new THREE.Vector3(0, 0, -1 / 300),
			}),
			body.makeMoon({
				color: 0xbbbbff,
				radius: 0.3,
				startingPosition: new THREE.Vector3(5, 3, 0), 
				initialVelocity: new THREE.Vector3(0, -1 / 600, -1 / 600),
			}),
			body.makeMoon({
				color: 0xbbffbb,
				radius: 0.04,
				startingPosition: new THREE.Vector3(7, 0, 0), 
				initialVelocity: new THREE.Vector3(0, 0, -1 / 190),
			}),
		);

		camera.lookAt(physics.bodies[0].mesh.position);
		
		physics.addAllToScene(scene);
		renderer.setSize( width, height );
		renderer.setAnimationLoop( physics.animate(renderer, scene, camera) );
		startButton.textContent = 'Reset';
		startButton.onclick = reset;
	} catch (err) {
		if (typeof err === "string") {
			showError(err);
		} else if (err instanceof Error) {
			showError(`${err.message}: (${err.stack})`);
		} else {
			showError('an unknown error occurred');
		}
		throw err;
	}
}

function reset() {
	scene.background = null;
	scene.clear();
	physics.clear();
	renderer.clear(false);
	renderer.setAnimationLoop(null);

	startButton.onclick = start;
	startButton.textContent = 'Start';
}

startButton.onclick = start

function showError(text: string) {
	const errorDiv = document.getElementById("error")! as HTMLDivElement
	errorDiv.hidden = false;
	errorDiv.textContent = text;
}