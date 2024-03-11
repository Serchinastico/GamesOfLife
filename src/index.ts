import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import gameOfLifeShader from "./shaders/classicGameOfLife.fs";

const BORN = 0b00001000;
const SURVIVE = 0b00001100;

interface Simulation {
  renderTargetA: THREE.WebGLRenderTarget<THREE.Texture>;
  renderTargetB: THREE.WebGLRenderTarget<THREE.Texture>;
  material: THREE.ShaderMaterial;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

interface SimulationProps {
  width: number;
  height: number;
  worldTexture: THREE.DataTexture;
}

function createSimulation({
  width,
  height,
  worldTexture,
}: SimulationProps): Simulation {
  const scene = new THREE.Scene();
  const camera = createCamera(width, height);
  const renderTargetA = createRenderTarget(width, height);
  const renderTargetB = createRenderTarget(width, height);

  const worldTextureScale = new THREE.Vector2(width, height);

  const steps = [Math.random(), Math.random(), Math.random(), Math.random()];
  steps.sort();

  const born = Math.round(Math.random() * 256);
  const survive = Math.round(Math.random() * 256);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: gameOfLifeShader,
    uniforms: {
      uState: { value: worldTexture },
      uScale: { value: worldTextureScale },
      uSteps: {
        value: new THREE.Vector4(steps[0], steps[1], steps[2], steps[3]),
      },
      uSeed: { value: Math.random() },
      uBorn: { value: BORN },
      uSurvive: { value: SURVIVE },
      uBornRnd: { value: born },
      uSurviveRnd: { value: survive },
    },
  });

  const geometry = createPlaneGeometry(width, height);

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  return {
    renderTargetA,
    renderTargetB,
    material,
    scene,
    camera,
  };
}

function createCamera(width: number, height: number) {
  const camera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0.1,
    1000
  );
  camera.position.z = 1;
  return camera;
}

function createWorldTexture(width: number, height: number) {
  const size = width * height;
  const data = new Uint8Array(4 * size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;
    const rgb = Math.random() < 0.5 ? 255 : 0;

    data[stride] = rgb;
    data[stride + 1] = rgb;
    data[stride + 2] = rgb;
    data[stride + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;

  return texture;
}

function createPlaneGeometry(width: number, height: number) {
  return new THREE.PlaneGeometry(width, height);
}

function createRenderTarget(width: number, height: number) {
  return new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    stencilBuffer: false,
    depthBuffer: false,
  });
}

function main() {
  const width = window.innerWidth,
    height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /**
   * The rendering components consisting of a scene with a single plane
   * with a texture that is the representation of the computed game of life
   */
  const renderScene = new THREE.Scene();
  const renderCamera = createCamera(width, height);

  /**
   * The simulation consists of a different scene where we include our
   * simulation fragments that will take care of "rendering" (or computing)
   * the result of a step in the game of life and printing it in a texture
   */
  const simulationWidth = 200;
  const simulationHeight = 200;
  const worldTexture = createWorldTexture(simulationWidth, simulationHeight);
  const simulations: Simulation[] = [];
  const columns = Math.floor(window.innerWidth / simulationWidth) + 2;
  const rows = Math.floor(window.innerHeight / simulationHeight) + 2;
  const numSimulations = rows * columns;

  for (let i = 0; i < numSimulations; i++) {
    simulations.push(
      createSimulation({
        width: simulationWidth,
        height: simulationHeight,
        worldTexture,
      })
    );
  }

  // Insert the simulation in the rendered scene as textures
  simulations.forEach((simulation, index) => {
    const renderGeometry = createPlaneGeometry(
      simulationWidth,
      simulationHeight
    );
    const renderMaterial = new THREE.MeshBasicMaterial({
      map: simulation.renderTargetA.texture,
    });

    const renderPlane = new THREE.Mesh(renderGeometry, renderMaterial);
    renderPlane.translateX(
      (index % columns) * simulationWidth - window.innerWidth / 2
    );
    renderPlane.translateY(
      Math.floor(index / columns) * simulationHeight - window.innerHeight / 2
    );
    renderScene.add(renderPlane);

    console.log(
      `Simulation ${index} (x: ${index % columns}, y: ${Math.floor(
        index / columns
      )}) - Born: ${simulation.material.uniforms.uBornRnd.value} - Survive: ${
        simulation.material.uniforms.uSurviveRnd.value
      }`
    );
  });

  function animate() {
    // Update game of life by (ab)using WebGL
    simulations.forEach((simulation) => {
      renderer.setRenderTarget(simulation.renderTargetA);
      renderer.render(simulation.scene, simulation.camera);
    });

    // Render the game of life on screen
    renderer.setRenderTarget(null);
    renderer.render(renderScene, renderCamera);

    // Ping pong frame buffers
    simulations.forEach((simulation) => {
      [simulation.renderTargetA, simulation.renderTargetB] = [
        simulation.renderTargetB,
        simulation.renderTargetA,
      ];
      simulation.material.uniforms.uState.value =
        simulation.renderTargetB.texture;
    });

    setTimeout(() => requestAnimationFrame(animate), 0);
  }

  animate();
}

document.addEventListener("DOMContentLoaded", main);
