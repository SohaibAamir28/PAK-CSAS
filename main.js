import "/style.css"
import { planetParams, satelliteParams, nearEarthObjects } from "/data";
import { timeScale } from "./script";
import * as THREE from "three"
import CameraControls from "camera-controls"
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { pass } from "three/webgpu";

// Init
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight,
  0.1, 200000000
)
CameraControls.install( {THREE: THREE} )
const renderer = new THREE.WebGLRenderer( {canvas: document.querySelector("#orrery")} )

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

const resetCamera = () => {
  camera.position.set(0, 500, 500)
  camera.lookAt(0, 0, 0)
}

const textureLoader = new THREE.TextureLoader()
const ambient_light = new THREE.AmbientLight(0x222222)
const sunlight = new THREE.PointLight(0xffffff, 1000000, 0, 2)

scene.add(ambient_light)
scene.add(sunlight)
sunlight.position.set(0,0,0)
sunlight.castShadow = true

resetCamera()

// Dev
const gridHelper = new THREE.GridHelper(100000, 50)
const axesHelper = new THREE.AxesHelper(50000)

scene.add(gridHelper, axesHelper)

// Kepler's equation solver functions
function KeplerStart3(e, M) {
  const t34 = e ** 2
  const t35 = e * t34
  return M + (-1 / 2 * t35 + e + (t34 + 3 / 2 * Math.cos(M) * t35) * Math.sin(M))
}

function eps3(e, M, x) {
  const t1 = Math.cos(x)
  const t2 = -1 + e * t1
  const t3 = Math.sin(x)
  const t4 = e * t3
  const t5 = -x + t4 + M
  return t5 / ((1 / 2 * t3 - 1 / 6 * t1 * t5) * e + t2)
}

function KeplerSolve(e, M) {
  const tol = 1.0e-14
  const Mnorm = M % (2 * Math.PI)
  let E0 = KeplerStart3(e, Mnorm)
  let dE = tol + 1
  let count = 0

  while (dE > tol) {
    const E = E0 - eps3(e, Mnorm, E0)
    dE = Math.abs(E - E0)
    E0 = E
    count++
    if (count === 100) {
      console.error("KeplerSolve failed to converge")
      break
    }
  }
  return E0
}
  
// Propagate function to calculate the position of each planet
function propagate(clock, smA, oE, period, inclination, center = new THREE.Vector3(0, 0, 0)) {
  const T = -period  // Planet's orbital period
  const n = 2 * Math.PI / T
  const tau = 0  // Time of pericenter passage
  const M = n * (clock - tau)
  const E = KeplerSolve(oE, M)
  
  const r = smA * (1 - oE * Math.cos(E))
  const s_x = r * ((Math.cos(E) - oE) / (1 - oE * Math.cos(E)))
  const s_z = r * ((Math.sqrt(1 - oE ** 2) * Math.sin(E)) / (1 - oE * Math.cos(E)))
  const s_y = 0  // Orbit initially lies in XZ plane
  
  // Create position vector in XZ plane
  let position = new THREE.Vector3(s_x, s_y, s_z)
  // Apply tilt (inclination) by rotating around the X axis
  const tiltMatrix = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(inclination))
  position.applyMatrix4(tiltMatrix)

  // Translate the position relative to the given orbit center
  position.add(center)

  return position
}

// Stars/Planets/Objects
// TODO: Accurately model the size of planets
function createPlanet(size, texturePath) {
  return new THREE.Mesh(
      new THREE.SphereGeometry(size, 50, 50),
      new THREE.MeshStandardMaterial({
          map: texturePath ? textureLoader.load(texturePath) : null,
      })
  )
}

const distanceScaleFactor = 1000
const sizeScaleFactor = 1/1000

const sunSize = 1392700 * sizeScaleFactor / 10
const sun = createPlanet(sunSize, "/textures/8k_sun.jpg")
sun.material.color = new THREE.Color(255,255,150)
sun.name = "sun"

const Textholder = document.createElement('p')
Textholder.name = "Sun";
Textholder.textContent = "Sun";
Textholder.style.color = 'white';
Textholder.style.fontFamily = 'Poppins', 'monospace';
Textholder.style.fontSize = '12px';
Textholder.className = 'PlanetLabels';

// Create planets, textsand their orbit lines
const planets = {}
const orbitLines = {}
const names = {}
const interactables = new THREE.Group()
interactables.add(sun)

const RenderField = new CSS2DRenderer();
RenderField.setSize(window.innerWidth, window.innerHeight);
RenderField.domElement.style.position = 'absolute';
RenderField.domElement.style.top = '0px';
RenderField.domElement.style.pointerEvents = 'none'; //eventlisteners won't turn to this container
document.body.appendChild(RenderField.domElement)
//Creating the container where the html objects would be contained

const labels = new THREE.Group()

const sunLabel = new CSS2DObject(Textholder);
names[sun] = sunLabel;
labels.add(sunLabel);

for (const planet in planetParams) {
  const params = planetParams[planet]

  // Create planet mesh
  const planetGroup = new THREE.Group()
  const planetMesh = createPlanet(params.size, params.texturePath)
  planetGroup.add(planetMesh)

  scene.add(planetGroup)
  planets[planet] = planetGroup
  interactables.add(planetGroup)
  planetGroup.name = params.tag

  // Calculate orbit points
  const orbitPoints = []
  const orbitSlices = params.period + 1 // Number of points for the orbit
  for (let i = 0; i < orbitSlices; i++) {
    const position = propagate(i, params.smA, params.oE, params.period, params.inclination)
    orbitPoints.push(position)
  }

  // Create orbit line geometry
  const orbitLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPoints),
    new THREE.LineBasicMaterial({ color: params.color })
  )
  scene.add(orbitLine)
  orbitLines[planet] = orbitLine

  //create label for each planet
  const Textholder = document.createElement('p')
  Textholder.name = params.tag;
  Textholder.textContent = params.tag;
  Textholder.style.color = 'white';
  Textholder.style.fontFamily = 'Poppins', 'monospace';
  Textholder.style.fontSize = '12px';
  Textholder.className = 'PlanetLabels';
  const PlanetLabel = new CSS2DObject(Textholder);
  names[planet] = PlanetLabel;
  labels.add(PlanetLabel);
}

const satellites = {}
const satellitesOrbitLines = {}
for (const satellite in satelliteParams) {
  const params = satelliteParams[satellite]

  const satelliteGroup = new THREE.Group()
  const satelliteMesh = createPlanet(params.size, params.texturePath)
  satelliteGroup.add(satelliteMesh)
  scene.add(satelliteGroup)
  satellites[satellite] = satelliteGroup
  interactables.add(satelliteGroup)
  satelliteGroup.name = params.tag

  // Calculate orbit points
  const orbitPoints = []
  const orbitSlices = params.period + 1 // Number of points for the orbit
  for (let i = 0; i < orbitSlices; i++) {
    const position = propagate(i, params.smA, params.oE, params.period, params.inclination, params.center)
    orbitPoints.push(position)
  }
  // Create orbit line geometry
  const orbitLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPoints),
    new THREE.LineBasicMaterial({ color: params.color })
  )
  scene.add(orbitLine)
  satellitesOrbitLines[satellite] = orbitLine

  const Textholder = document.createElement('p')
  Textholder.name = params.tag;
  Textholder.textContent = params.tag;
  Textholder.style.color = 'white';
  Textholder.style.fontFamily = 'Poppins', 'monospace';
  Textholder.style.fontSize = '12px';
  Textholder.className = 'PlanetLabels';
  const satelliteLabel = new CSS2DObject(Textholder);
  names[satellite] = satelliteLabel;
  labels.add(satelliteLabel);
}

const nEOs = {}
const nEOOrbitLines = {}
for (const nEO in nearEarthObjects) {
  const params = nearEarthObjects[nEO]
  // Create nEO mesh
  const nEOGroup = new THREE.Group()
  const nEOMesh = createPlanet(params.size)
  nEOGroup.add(nEOMesh)
  scene.add(nEOGroup)
  nEOs[nEO] = nEOGroup
  interactables.add(nEOGroup)
  nEOGroup.name = params.tag

  // Calculate orbit points
  const orbitPoints = []
  const orbitSlices = params.period + 1 // Number of points for the orbit
  for (let i = 0; i < orbitSlices; i++) {
    const position = propagate(i, params.smA, params.oE, params.period, params.inclination, params.center)
    orbitPoints.push(position)
  }
  // Create orbit line geometry
  const orbitLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPoints),
    new THREE.LineBasicMaterial({ color: params.color })
  )
  scene.add(orbitLine)
  nEOOrbitLines[nEO] = orbitLine

  const Textholder = document.createElement('p')
  Textholder.name = params.tag;
  Textholder.textContent = params.tag;
  Textholder.style.color = 'white';
  Textholder.style.fontFamily = 'Poppins', 'monospace';
  Textholder.style.fontSize = '12px';
  Textholder.className = 'PlanetLabels';
  const nEOLabel = new CSS2DObject(Textholder);
  names[nEO] = nEOLabel;
  labels.add(nEOLabel);
}

scene.add(labels)

// Asteroids
const asteroids = [];

function addAsteroid(amount) {
  for (let j = 0; j < amount; j++) {
    const params = {
      size: THREE.MathUtils.randFloat(5, 10),
      smA: (Math.random() < 0.5 ? -1 : 1) * THREE.MathUtils.randFloat(2.5 * distanceScaleFactor, 3.0 * distanceScaleFactor),
      oE: (Math.random() < 0.5 ? -1 : 1) * THREE.MathUtils.randFloat(0.07, 0.4),
      period: THREE.MathUtils.randFloat(1095.75, 2191.5), // 3 to 6 years
      inclination: (Math.random() < 0.5 ? -1 : 1) * THREE.MathUtils.randFloat(4, 30)
    };

    const asteroid = createPlanet(params.size)
    asteroids.push({ mesh: asteroid, params });

    const initialPosition = propagate(0, params.smA, params.oE, params.period, params.inclination);
    asteroid.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    
    scene.add(asteroid);
  }
}

addAsteroid(1000);

scene.add(interactables)

// Main
const cameraClock = new THREE.Clock()
const cameraControls = new CameraControls(camera, renderer.domElement)
cameraControls.enableDamping = true
cameraControls.smoothTime = 0.1

//Raycast
const raycaster = new THREE.Raycaster()
var savedObject = null
var savedColor = null
var selected  = false

document.addEventListener('mousemove', onHover) //trigger a function upon the mouse being clicked
document.addEventListener('mousedown', onClick)

const info_bar = document.querySelector(".information")
const name = document.getElementById("planet-name")
const size = document.getElementById("size")
const sma = document.getElementById("sma")
const oe = document.getElementById("oe")
const rp = document.getElementById("rp")
const period = document.getElementById("period")
const inclination = document.getElementById("inclination")
const desc = document.getElementById("desc")

function onClick(event) {
  if (event.button === 2) {
    if (selected === true) {
      savedObject.material.color = savedColor
      selected = false
    }
    info_bar.classList.remove("visible")
  }
  if (event.button === 0) {
    if (savedObject) {
      selected = true
      var color = new THREE.Color(1, 1, 1)
      savedObject.material.color  = color
      info_bar.classList.add("visible")

      const distanceScaleFactor = 1000
      const sizeScaleFactor = 1/100
      const nEOScale = 4

      const parent = savedObject.parent.name
      let description = null
      if (savedObject.name == "sun") {
        name.innerText = "Sun"
        size.innerText = sunSize * 10 / sizeScaleFactor
        sma.innerText = null
        oe.innerText = null
        rp.innerText = "24.47"
        period.innerText = null
        inclination.innerText = null
        desc.innerText = null
      } else if (parent in planetParams) {
        description = planetParams[parent]

        name.innerText = description.tag
        size.innerText = description.size / sizeScaleFactor
        sma.innerText = description.smA / distanceScaleFactor
        oe.innerText = description.oE
        rp.innerText = description.rotationPeriod
        period.innerText = description.period
        inclination.innerText = description.inclination
        desc.innerText = description.desc
      } else if (parent in satelliteParams) {
        description = satelliteParams[parent]

        name.innerText = description.tag
        size.innerText = description.size / sizeScaleFactor
        sma.innerText = description.smA / distanceScaleFactor
        oe.innerText = description.oE
        rp.innerText = description.rotationPeriod
        period.innerText = description.period
        inclination.innerText = description.inclination
        desc.innerText = description.desc
      } else if (parent in nearEarthObjects) {
        description = nearEarthObjects[parent]

        name.innerText = description.tag
        size.innerText = description.size / nEOScale
        sma.innerText = description.smA / distanceScaleFactor
        oe.innerText = description.oE
        rp.innerText = description.rotationPeriod
        period.innerText = description.period
        inclination.innerText = description.inclination
        desc.innerText = description.desc
      }
    }
    else {
      return
    }
  }
}

function onHover(event) {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) *2 -1),
  )

  raycaster.setFromCamera(coords, camera)
  const intersections = raycaster.intersectObjects(interactables.children, true) //First arg - objects we wanna intersect against - children of our scene/canvas
  
  if (selected === false) {
    if (intersections.length && savedObject) {
      //console.log(intersections) This ALONE will return an array of the intersections, and their positions, the objects are returned sorted by distances, the closest first
      var selectedObject = intersections[0].object //Returns the first object to collide with the raycaster 
      if (selectedObject != savedObject && savedColor) {
        savedObject.material.color = savedColor
        savedObject = null
        savedColor = null
      }
      else if (selectedObject === savedObject){
        var color = new THREE.Color(5, 5, 5)
        selectedObject.material.color = color
      }
      else {
        savedObject = null
        savedColor = null
      }
    }
    else {
      try {
        savedObject = intersections[0].object
        if (savedObject.material.color) {
          savedColor = savedObject.material.color
        }
      }
      catch { //If mouse hovers on nothing, it returns an error, so I hafta result to "catch" for this one
        savedObject.material.color = savedColor
        savedObject = null
        savedColor = null
      }
    }
  }
}

function animate() {
  const delta = cameraClock.getDelta()
  cameraControls.update(delta)
  
  requestAnimationFrame(animate)
  
  const totalElapsedTime = (cameraClock.getElapsedTime() * timeScale) + 10000

  //If selected
  if (selected === true) {
    var Subject = savedObject.parent //get the actual object not the mesh

    if (savedObject.name == "sun") {
      camera.position.x = Subject.position.x + (sunSize * 2)
      camera.position.y = Subject.position.y
      camera.position.z = Subject.position.z + (sunSize * 2)
      camera.lookAt(Subject.position.x, Subject.position.y, Subject.position.z)
    } else if (Subject.name in satelliteParams) {
      camera.position.x = Subject.position.x + (satelliteParams[Subject.name].size * 2)
      camera.position.y = Subject.position.y
      camera.position.z = Subject.position.z + (satelliteParams[Subject.name].size * 2)
      camera.lookAt(Subject.position.x, Subject.position.y, Subject.position.z)  
    } else if (Subject.name in nearEarthObjects) {
      camera.position.x = Subject.position.x + (nearEarthObjects[Subject.name].size * 2)
      camera.position.y = Subject.position.y
      camera.position.z = Subject.position.z + (nearEarthObjects[Subject.name].size * 2)
      camera.lookAt(Subject.position.x, Subject.position.y, Subject.position.z)  
    } else {
      camera.position.x = Subject.position.x + (planetParams[Subject.name].size * 2)
      camera.position.y = Subject.position.y
      camera.position.z = Subject.position.z + (planetParams[Subject.name].size * 2)
      camera.lookAt(Subject.position.x, Subject.position.y, Subject.position.z)  
    }

    window.addEventListener('keydown', function (e) {
      if (e.key == "Escape") {
        selected = false
        info_bar.classList.remove("visible")
        resetCamera()          
      }
    }, false);
  }
  
  // Update each planet's and their text position
  names[sun].position.set(0, -(sunSize + 15), 0)

  for (const planet in planetParams) {
    const params = planetParams[planet]
    const position = propagate(totalElapsedTime, params.smA, params.oE, params.period, params.inclination)
    planets[planet].position.set(position.x, position.y, position.z)
    names[planet].position.set(position.x, (position.y - (params.size + 15)), position.z)
    const rotationSpeed = (2 * Math.PI) / params.rotationPeriod
    planets[planet].rotation.y += rotationSpeed * delta * timeScale
  }

  for (const satellite in satelliteParams) {
    const params = satelliteParams[satellite]
    const position = propagate(totalElapsedTime, params.smA, params.oE, params.period, params.inclination)
    satellites[satellite].position.set(position.x + planets[params.parent].position.x, position.y + planets[params.parent].position.y, position.z + planets[params.parent].position.z)
    satellitesOrbitLines[satellite].position.set(planets[params.parent].position.x, planets[params.parent].position.y, planets[params.parent].position.z)
    names[satellite].position.set(position.x + planets[params.parent].position.x, (position.y + planets[params.parent].position.y - (params.size + 15)), position.z + planets[params.parent].position.z)
    if (params.rotationSpeed) {
      const rotationSpeed = (2 * Math.PI) / params.rotationPeriod
      satellites[satellite].rotation.y += rotationSpeed * delta * timeScale
    }
  }
  
  for (const nEO in nearEarthObjects) {
    const params = nearEarthObjects[nEO]
    const position = propagate(totalElapsedTime, params.smA, params.oE, params.period, params.inclination, params.center)
    nEOs[nEO].position.set(position.x, position.y, position.z)
    names[nEO].position.set(position.x, (position.y - (params.size + 15)), position.z);
    if (params.rotationPeriod){
      const rotationSpeed = (2 * Math.PI) / params.rotationPeriod
      nEOs[nEO].rotation.y += rotationSpeed * delta * timeScale
    }
  }

  for (const asteroid of asteroids) {
    const params = asteroid.params;
    const asteroidMesh = asteroid.mesh;

    const position = propagate(totalElapsedTime, params.smA, params.oE, params.period, params.inclination);
    asteroidMesh.position.set(position.x, position.y, position.z);
  }

  RenderField.render(scene, camera);
  renderer.render(scene, camera)
}

animate()

export { orbitLines, satellitesOrbitLines, nEOOrbitLines }