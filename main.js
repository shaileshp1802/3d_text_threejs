import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import vertex from './shaders/donut/vertex.glsl?raw'
import fragment from './shaders/donut/fragment.glsl?raw'


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
THREE.Cache.enabled = true

const gui = new dat.GUI({ width: 400 })


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)

const parameters = {
  uTime: 1,
}


// const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = (e)=>{
//   console.log(e);
//   console.log('start');
// }
// loadingManager.onProgress =()=> {
//   console.log('progress')
// }
// loadingManager.onLoad=()=>{
//   console.log('load');
// }
// loadingManager.onError= ()=>{
//   console.log('error');
// }

// const textureLoader = new THREE.TextureLoader(loadingManager)
// const aoTexture = textureLoader.load('/texture/medieval_wood_ao_1k.jpg')
// const armTexture = textureLoader.load('/texture/medieval_wood_arm_1k.jpg')
// const diffTexture = textureLoader.load('/texture/medieval_wood_diff_1k.jpg')
// const nor_Texture = textureLoader.load('/texture/medieval_wood_nor_gl_1k.png')
// const dispTexture = textureLoader.load('/texture/medieval_wood_disp_1k.jpg')
// const roughTexture = textureLoader.load('/texture/medieval_wood_rough_1k.jpg')


// diffTexture.repeat.x = 2
// diffTexture.repeat.y = 2
// diffTexture.wrapS = THREE.RepeatWrapping
// diffTexture.wrapT = THREE.RepeatWrapping

// diffTexture.minFilter = THREE.NearestFilter

const pointLight = new THREE.PointLight()
pointLight.intensity = 1
pointLight.position.y = 4
pointLight.position.z = 4
scene.add(pointLight)




const count = 800;
const donutGeo = new THREE.TorusGeometry(0.8,0.5,16,16);
const donutMat = new THREE.ShaderMaterial(
  {
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: {value: parameters.uTime}
    }
  }
);

const fontLoader = new FontLoader()
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const geometry = new TextGeometry('Shailesh Paliwal', {
    size: 0.5,
    font: font,
    height: 0.2,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  })

  // const material = new THREE.MeshNormalMaterial({})
  const text = new THREE.Mesh(geometry, donutMat)
  scene.add(text)
  geometry.center()

})

for(let i=0; i<count; i++){
  const sValue = Math.random() * 0.5;
  const donut = new THREE.Mesh(donutGeo, donutMat)
  scene.add(donut)
  donut.position.x = (Math.random() - 0.5) * 25
  donut.position.y = (Math.random() - 0.5) * 25
  donut.position.z = (Math.random() - 0.5) * 25

  donut.rotation.x = (Math.random() * Math.PI)
  donut.rotation.y = (Math.random() * Math.PI)

  donut.scale.set(sValue, sValue, sValue)
}





const canvas = document.querySelector('.webgl')

const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true
orbitControls.maxDistance = 10
orbitControls.maxPolarAngle = Math.PI * 0.75
orbitControls.maxAzimuthAngle = Math.PI * 0.55
orbitControls.minAzimuthAngle = - Math.PI * 0.55

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  }
  else {
    document.exitFullscreen()
  }
})


const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  parameters.uTime = elapsedTime
  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)

}

tick()

