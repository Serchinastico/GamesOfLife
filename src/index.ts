import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const BORN = 0b00001000;
const SURVIVE = 0b00001100;

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
    data[stride] = Math.random() < 0.5 ? 255 : 0;
    data[stride + 1] = 0;
    data[stride + 2] = 0;
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
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /**
   * The rendering components consisting of a scene with a single plane
   * with a texture that is the representation of the computed game of life
   */
  const renderScene = new THREE.Scene();
  const renderCamera = createCamera(window.innerWidth, window.innerHeight);
  const renderGeometry = createPlaneGeometry(
    window.innerWidth,
    window.innerHeight
  );

  /**
   * The simulation consists of a different scene where we include our
   * simulation fragments that will take care of "rendering" (or computing)
   * the result of a step in the game of life and printing it in a texture
   */
  const simulationScene = new THREE.Scene();
  const simulationCamera = createCamera(window.innerWidth, window.innerHeight);
  let simulationA = createRenderTarget(window.innerWidth, window.innerHeight);
  let simulationB = createRenderTarget(window.innerWidth, window.innerHeight);

  const worldTexture = createWorldTexture(
    window.innerWidth,
    window.innerHeight
  );
  const worldTextureScale = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );

  const simulationMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uState: { value: worldTexture },
      uScale: { value: worldTextureScale },
      uBorn: { value: BORN },
      uSurvive: { value: SURVIVE },
    },
  });

  const simulationGeometry = createPlaneGeometry(
    window.innerWidth,
    window.innerHeight
  );

  const simulationPlane = new THREE.Mesh(
    simulationGeometry,
    simulationMaterial
  );
  simulationScene.add(simulationPlane);

  const renderMaterial = new THREE.MeshBasicMaterial({
    map: simulationA.texture,
  });
  const renderPlane = new THREE.Mesh(renderGeometry, renderMaterial);
  renderScene.add(renderPlane);

  function animate() {
    // Update game of life by (ab)using WebGL
    renderer.setRenderTarget(simulationA);
    renderer.render(simulationScene, simulationCamera);

    // Render the game of life on screen
    renderer.setRenderTarget(null);
    renderer.render(renderScene, renderCamera);

    // Ping pong frame buffers
    [simulationA, simulationB] = [simulationB, simulationA];
    simulationMaterial.uniforms.uState.value = simulationB.texture;
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener("DOMContentLoaded", main);
