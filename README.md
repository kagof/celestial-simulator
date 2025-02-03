# Celestial System Simulator

This is the source code for [celestialsimulator.kagof.com](https://celestialsimulator.kagof.com/), a 3D celestial orbit simulator for the browser, written using Three.js.

![](examples/page.png)

## Building & Running

To run it locally, simply run:
```sh
npm i
npm run dev
```

and open `localhost:4000` in your browser.

to build a production bundle, run:
```sh
npm run build
```

to run a production preview, run:
```sh
npm run preview
```

and to clean up the files created, run:
```sh
npm run clean
```

## Technical details

The simulation is created in a basic static HTML webpage. The simulation is written in [Three.js](https://github.com/mrdoob/three.js/). Textures & normal maps were taken from [NASA's Scientific Visualization Studio](https://svs.gsfc.nasa.gov/4720). Colors for the webpage are based on the [Catppuccin Mocha](https://github.com/catppuccin/palette/blob/main/docs/css.md) palette. [Vite](https://vite.dev/) is used for bundling & as a local dev server.

## Simulation

The simulator calculations changes in acceleration using [the general equation for Newtonian gravity](https://en.wikipedia.org/wiki/N-body_problem):

```math
m_i\frac{d^2\mathbf{q}_i}{dt^2}=\sum_{j=0,j\neq i}^{n-1}{\frac{Gm_im_j(\mathbf{q}_j-\mathbf{q}_i)}{\|\mathbf{q}_j-\mathbf{q}_i\|^3}}
```

* $m_k$ is the mass of body $k$
* $\mathbf{q}_k$ is the position of body $k$
* $G$ is the gravitational constant
* $\lVert\mathbf{q}_l-\mathbf{q}_k\rVert$ is the magnitude of the Euclidean distance between bodies $k$ and $l$

## Features

The simulator currently features:

* Newtonian gravity between n objects
* Live adjustable gravitational constant G
* Lighting with shadows & normals
* Adjustable body size, density, rotation, shininess, initial velocity & position (though not exposed to the end user yet) 

## Features to build

I intend to add:

* elastic collisions between bodies
* fading trails behind bodies
* camera controls/following
* customizable number of bodies
* customization of bodies' starting properties (size, color, density, rotation, initial velocity & position)
* randomizer
* import/export setup to/from JSON