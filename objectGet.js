const name = document.getElementById("planet-name")
const size = document.getElementById("size")
const sma = document.getElementById("sma")
const oe = document.getElementById("oe")
const rp = document.getElementById("rp")
const period = document.getElementById("period")
const inclination = document.getElementById("inclination")

import { planetParams } from "./data";

Object.keys(planetParams).forEach(planet => {
    const planetData = planetParams[planet];
    name.innerText = planetData.tag
    size.innerText = planetData.size
    sma.innerText = planetData.smA
    oe.innerText = planetData.oE
    rp.innerText = planetData.rotationPeriod
    period.innerText = planetData.period
    inclination.innerText = planetData.inclination
})