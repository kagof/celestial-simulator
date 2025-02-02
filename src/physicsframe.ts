import * as THREE from 'three';
import {Body} from './body'

export class PhysicsFrame {
    gravitationalConstant: number;
    prevTime: number;
    bodies: Body[];
        constructor (gravitationalConstant:number, ...bodies: Body[]) {
            this.gravitationalConstant = gravitationalConstant
            this.prevTime = -1
            this.bodies = bodies || [];
        }

        clear() {
            this.bodies.length = 0;
            this.prevTime = -1;
        }

        add(...newBodies: Body[]) {
            this.bodies.push(...newBodies);
        }

        animate(renderer: THREE.WebGLRenderer, 
            scene: THREE.Scene, 
            camera: THREE.Camera): (time: number) => void {
            return (time) => {
                const delta_t = time - this.prevTime;
                if (this.prevTime === -1 || delta_t > 300) {
                    // either the first frame, or there's been a large lapse in time 
                    // don't calculate physics or movement/rotation
                    this.prevTime = time;
                    renderer.render(scene, camera);
                    return;
                }
                this.__calcPhysics(delta_t);
                for (const body of this.bodies) {
                    body.move(delta_t);
                    body.rotate(delta_t);
                }
                this.prevTime = time;
                renderer.render(scene, camera);
            }
        }

        addAllToScene(scene: THREE.Scene) {
            for (const body of this.bodies) {
                scene.add(body.mesh);
            }
        }

        private __calcPhysics(time: number) {
            if (this.gravitationalConstant === 0) {
                // it will equal zero; don't waste time calculating
                return;
            }
            for (var i = 0; i < this.bodies.length; ++i) {
                this.__calcForBody(time, i);
            }
        }

        private __calcForBody(time: number, i: number) {
            // delta_v = a * t
            this.bodies[i].velocity.add(this.__getAccelerationForBody(i).multiplyScalar(time));
        }

        private __getAccelerationForBody(i: number): THREE.Vector3 {
            // m_i*d^2q_i/dt^2=sum(j=0, j!=i ... j=n-1) of (G*m_i*m_j*(q_j-q_i)) / (||q_j - q_i ||^3)
            var acceleration = new THREE.Vector3(0, 0, 0);
            const body_i = this.bodies[i];
            for (const [j, body_j] of this.bodies.entries()) {
                if (i === j) {
                    continue;
                }
                acceleration.add(this.__calcTerm(body_i, body_j));
            }
            return acceleration.divideScalar(body_i.mass)
        }

        private __calcTerm(body_i: Body, body_j: Body): THREE.Vector3 {
            // (G*m_i*m_j*(q_j-q_i)) / (||q_j - q_i ||^3)
            const gmimj = this.gravitationalConstant * body_i.mass * body_j.mass;
            
            return body_j.mesh.position.clone()
                .sub(body_i.mesh.position)
                .multiplyScalar(gmimj)
                .divideScalar(Math.pow(Math.abs(body_j.mesh.position.distanceTo(body_i.mesh.position)), 3));
        }
 }
