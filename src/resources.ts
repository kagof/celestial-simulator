import * as THREE from 'three';

export class Resources {
    textureLoader: THREE.TextureLoader;
    constructor(onEagerLoad: () => void, onEagerLoadError: (s: string) => void) {
        THREE.Cache.enabled = true;
        this.textureLoader = new THREE.TextureLoader();
        this.eagerLoad(onEagerLoad, onEagerLoadError);
    }

    load(str: string): THREE.Texture {
        return this.textureLoader.load(str);
    }

    private eagerLoad(onLoad: () => void, onError: (s: string) => void) {
        const loaded: {
            [key: string]: boolean
        } = {
            "ldem_4.png": false,
            "normal.png": false,
            "lroc_color_poles_2k.png": false,
        }

        for (const [n, _] of Object.entries(loaded)) {
            this.textureLoader.load(n, 
                () => {
                    loaded[n] = true
                    if (Object.values(loaded).reduce((a, b) => a && b)) {
                        onLoad();
                    }
                },
                () => {},
                () => {
                    onError(n);
                }
            )
        }
    }
}