import * as THREE from 'three';
import {resources} from './index';

export class Body {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    rotation: THREE.Vector3;
    mass: number;
    constructor (
        radius: number,
        density: number,
        startingPosition: THREE.Vector3,
        initialVelocity: THREE.Vector3,
        rotation: THREE.Vector3,
        material: THREE.Material,
    ) {
        if (radius <= 0) {
            throw new Error(`radius must be positive (${radius})`);
        }
        if (density <= 0) {
            throw new Error(`density must be positive (${density})`);
        }
        const geometry = new THREE.SphereGeometry(radius);
        // mass = volume * density = 4/3pi*r^3 * density
        this.mass = (4 / 3) * Math.PI * Math.pow(radius, 3) * density;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.translateX(startingPosition.x);
        this.mesh.translateY(startingPosition.y);
        this.mesh.translateZ(startingPosition.z);
        this.velocity = initialVelocity;
        this.rotation = rotation;
    }

    rotate(delta_t: number) {
        this.mesh.rotation
        this.mesh.rotation.x += delta_t * this.rotation.x;
        this.mesh.rotation.y += delta_t * this.rotation.y;       
        this.mesh.rotation.z += delta_t * this.rotation.z;       
    }

    move(delta_t: number) {
        this.mesh.position.add(this.velocity.clone().multiplyScalar(delta_t));
    }
}

export function makeMoon({
    radius = 1, 
    density = 1,
    startingPosition = new THREE.Vector3(),
    initialVelocity = new THREE.Vector3(),
    rotation = new THREE.Vector3(0, 1 / 600, 0),
    color = 0xfffefe,
    bump,
    bumpScale = 0.2,
    reflectivity = 0.5,
    clearcoat = 0.6,
    clearcoatRoughness = 0.375,
    clearcoatNormalScale = new THREE.Vector2(0.1, 0.1),
    normal,
    texture,
}: {
    radius?: number;
    density?: number;
    startingPosition?: THREE.Vector3;
    initialVelocity?: THREE.Vector3;
    rotation?: THREE.Vector3;
    color?: THREE.ColorRepresentation;
    bump?: THREE.Texture;
    bumpScale?: number;
    reflectivity?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    clearcoatNormalScale?: THREE.Vector2;
    normal?: THREE.Texture;
    texture?: THREE.Texture;
}): Body {
    bump = bump || resources.load('ldem_4.png');
    normal = normal || resources.load('normal.png');
    texture = texture || resources.load('lroc_color_poles_2k.png');
    return new Body(radius,
        density,
        startingPosition,
        initialVelocity,
        rotation,
        new THREE.MeshPhysicalMaterial({ 
            map: texture, 
            color: color,
            bumpMap: bump,
            bumpScale: bumpScale,
            reflectivity: reflectivity,
            clearcoat: clearcoat,
            clearcoatRoughness: clearcoatRoughness,
            clearcoatNormalMap: normal,
            clearcoatNormalScale: clearcoatNormalScale,
         }),
    );
}