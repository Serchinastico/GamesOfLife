import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import gameOfLifeShader from "./shaders/classicGameOfLife.fs";

const EXPLORE_MODE = false;
const BORN_OVERRIDE: number | null = 26;
const SURVIVE_OVERRIDE: number | null = 69;

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

  /**
   * We use born as a mask for survive because if a bit is already set for born
   * then we won't count it for survive (as the born predicate comes before the
   * survival one).
   *
   * The operation ~A & B is a reverse mask. It basically sets to 0 every bit
   * where A is 1 and sets it to whatever there is in B when A is 0
   */
  const born = Math.round(Math.random() * 256);
  const survive = ~born & Math.round(Math.random() * 256);

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
      uBornRnd: { value: BORN_OVERRIDE ?? born },
      uSurviveRnd: { value: SURVIVE_OVERRIDE ?? survive },
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

function logSimulationsTable({
  simulations,
  columns,
}: {
  simulations: Simulation[];
  columns: number;
}) {
  const table: string[][] = [];

  simulations.forEach((simulation, index) => {
    const row = Math.floor(index / columns);

    if (table[row] === undefined) {
      table.push([]);
    }

    table[row].push(
      `b${simulation.material.uniforms.uBornRnd.value}/s${simulation.material.uniforms.uSurviveRnd.value}`.padEnd(
        10,
        " "
      )
    );
  });

  table.reverse();

  table.forEach((row) => {
    console.log(`| ${row.join(" | ")} |`);
  });
}

function createSimulations(renderScene: THREE.Scene) {
  const simulationWidth = EXPLORE_MODE ? 200 : window.innerWidth;
  const simulationHeight = EXPLORE_MODE ? 200 : window.innerHeight;
  const worldTexture = createWorldTexture(simulationWidth, simulationHeight);

  const simulations: Simulation[] = [];
  const columns =
    Math.floor(window.innerWidth / simulationWidth) + (EXPLORE_MODE ? 2 : 0);
  const rows =
    Math.floor(window.innerHeight / simulationHeight) + (EXPLORE_MODE ? 2 : 0);
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

    /**
     * In explore mode we need to move all regions to their place
     */
    if (EXPLORE_MODE) {
      renderPlane.translateX(
        (index % columns) * simulationWidth - window.innerWidth / 2
      );
      renderPlane.translateY(
        Math.floor(index / columns) * simulationHeight - window.innerHeight / 2
      );
    }

    renderScene.add(renderPlane);
  });

  logSimulationsTable({ simulations, columns });

  return simulations;
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
  const simulations = createSimulations(renderScene);

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
