import { orbitLines, satellitesOrbitLines, nEOOrbitLines } from "/main.js"

var planetOrbitEnabled = true
var nEOOrbitEnabled = true
var satelliteOrbitEnabled = true

function togglePlanetOrbits() {
    if (planetOrbitEnabled === false) {
        for (var orbit in orbitLines) {
            orbitLines[orbit].visible = true
        }
        planetOrbitEnabled = true
    }
    else if (planetOrbitEnabled === true) {
        for (var orbit in orbitLines) {
            orbitLines[orbit].visible = false
        }
        planetOrbitEnabled = false
    }
}

function toggleNEOOrbits() {
    if (nEOOrbitEnabled === false) {
        for (var orbit in nEOOrbitLines) {
            nEOOrbitLines[orbit].visible = true
        }
        nEOOrbitEnabled = true
    }
    else if (nEOOrbitEnabled === true) {
        for (var orbit in nEOOrbitLines) {
            nEOOrbitLines[orbit].visible = false
        }
        nEOOrbitEnabled = false
    }
}

function toggleSatelliteOrbits() {
    if (satelliteOrbitEnabled === false) {
        for (var orbit in satellitesOrbitLines) {
            satellitesOrbitLines[orbit].visible = true
        }
        satelliteOrbitEnabled = true
    }
    else if (satelliteOrbitEnabled === true) {
        for (var orbit in satellitesOrbitLines) {
            satellitesOrbitLines[orbit].visible = false
        }
        satelliteOrbitEnabled = false
    }
}

window.togglePlanetOrbits = togglePlanetOrbits
window.toggleNEOOrbits = toggleNEOOrbits
window.toggleSatelliteOrbits = toggleSatelliteOrbits