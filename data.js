import * as THREE from "three"

const distanceScaleFactor = 1000
const sizeScaleFactor = 1/100

// in degrees
const planetParams = {
    mercury: { 
        tag:"mercury", 
        size: 4880 * sizeScaleFactor, 
        smA: 0.38709927 * distanceScaleFactor, 
        oE: 0.205, 
        color: 0xa9a9a9, 
        rotationPeriod: 58.666667, 
        period: 87.9090455, 
        inclination: 7.0, 
        texturePath: "/textures/8k_mercury.jpg",
        desc: "Mercury, the smallest planet in our solar system and the closest to the Sun, has no atmosphere, making it a world of extreme temperature fluctuations. It is a rocky planet with a heavily cratered surface, similar to Earth’s Moon."
    },
    venus: { 
        tag:"venus", 
        size: 12104 * sizeScaleFactor, 
        smA: 0.72333566 * distanceScaleFactor, 
        oE: 0.007, 
        color: 0xffc0cb, 
        rotationPeriod: 243.0180556, 
        period: 224.5469999, 
        inclination: 3.4, 
        texturePath: "/textures/8k_venus_surface.jpg",
        desc: "Venus, the second planet from the Sun, is similar in size and structure to Earth but has a thick, toxic atmosphere and surface temperatures hot enough to melt lead. Its runaway greenhouse effect makes it the hottest planet in our solar system."
    },
    earth: { 
        tag:"earth", 
        size: 12756 * sizeScaleFactor, 
        smA: 1.00000261 * distanceScaleFactor, 
        oE: 0.017, 
        color: 0x0000ff, 
        rotationPeriod: 0.97430521666, 
        period: 365.006351, 
        inclination: 0.0, 
        texturePath: "/textures/earth.jpg",
        desc: "Earth, the third planet from the Sun and the only known world to support life, has a rich diversity of ecosystems and a unique atmosphere that sustains liquid water. It's the fifth largest planet and features a surface covered by oceans, landmasses, and polar ice caps."
    },
    mars: { 
        tag:"mars", 
        size: 6792 * sizeScaleFactor, 
        smA: 1.52371034 * distanceScaleFactor, 
        oE: 0.093, 
        color: 0xff0000, 
        rotationPeriod: 1.025, 
        period: 686.509374, 
        inclination: 1.85, 
        texturePath: "/textures/8k_mars.jpg",
        desc: "Mars, the fourth planet from the Sun, is a cold desert world with a thin atmosphere. It is known for its red color, caused by iron oxide (rust) on its surface. Scientists believe Mars once had liquid water, making it a key focus in the search for signs of past life."
    },
    jupiter: { 
        tag:"jupiter", 
        size: 142984 * sizeScaleFactor, 
        smA: 5.20288700 * distanceScaleFactor, 
        oE: 0.048, 
        color: 0xffa500, 
        rotationPeriod: 0.4131944, 
        period: 4329.854475, 
        inclination: 1.3, 
        texturePath: "/textures/8k_jupiter.jpg",
        desc: "Jupiter, the fifth planet from the Sun and the largest in our solar system, is a gas giant with no solid surface. It is famous for its swirling clouds and the Great Red Spot, a giant storm that has raged for centuries."
    },
    saturn: { 
        tag:"saturn", 
        size: 120536 * sizeScaleFactor, 
        smA: 9.53667594 * distanceScaleFactor, 
        oE: 0.056, 
        color: 0xffd700, 
        rotationPeriod: 0.4395837, 
        period: 10748.33677, 
        inclination: 2.5, 
        texturePath: "/textures/saturnmap.jpg",
        desc: "Saturn, the sixth planet from the Sun, is known for its stunning ring system made of ice and rock. Like Jupiter, Saturn is a gas giant composed mostly of hydrogen and helium, and it is the second largest planet in the solar system."
    },
    uranus: { 
        tag:"uranus", 
        size: 51118 * sizeScaleFactor, 
        smA: 19.18916464 * distanceScaleFactor, 
        oE: 0.046, 
        color: 0x00ffff, 
        rotationPeriod: 0.71805522, 
        period: 30666.14879, 
        inclination: 0.77, 
        texturePath: "/textures/uranusmap.jpg",
        desc: "Uranus, the seventh planet from the Sun, is unique for its tilted axis, causing extreme seasons. It is an ice giant with a blue-green color due to methane in its atmosphere, and it has faint rings and a cold, windy atmosphere."
    },
    neptune: { 
        tag:"neptune", 
        size: 49528 * sizeScaleFactor, 
        smA: 30.06992276 * distanceScaleFactor, 
        oE: 0.010, 
        color: 0x00008b, 
        rotationPeriod: 0.666667, 
        period: 60148.8318, 
        inclination: 1.77, 
        texturePath: "/textures/neptunemap.jpg",
        desc: "Neptune, the eighth and farthest known planet from the Sun, is a dark, cold ice giant. Its blue color comes from the methane in its atmosphere. Known for its intense storms and high winds, Neptune is the windiest planet in our solar system."
    },
}

const satelliteParams = {
    moon : { 
        parent: "earth", 
        tag:"moon", 
        size: 1738.1 * sizeScaleFactor, 
        smA: 2.6e-03 * distanceScaleFactor * 100, 
        oE: 0.0549, 
        color: 0x0000ff, 
        rotationPeriod: 10, 
        period: 30, 
        inclination: 5.1, 
        texturePath: "/textures/8k_moon.jpg",
        desc: "The Moon is Earth's only natural satellite and one of the most well-known celestial bodies. Its surface is rocky and covered with craters, formed by ancient impacts. The Moon’s gravitational pull affects tides on Earth, and its phases have been observed and studied for thousands of years."
    },
}

const nEOScale = 4

const nearEarthObjects = {
    "162173 Ryugu": { 
        tag:"162173 Ryugu", 
        size: 0.896 * nEOScale, 
        smA: 1.191 * distanceScaleFactor, 
        oE: 0.1911, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.3180258333, 
        period: 474.5, 
        inclination: 5.87,
        nextcloseapproach: "2025-Jun-03 19:59 ± < 00:01, 0.37291 AU",
        closestapproach: "2076-Dec-06 05:43 ± < 00:01, 0.01044 AU",
        classification: "Apollo",
        desc: "Ryugu is a near-Earth object and potentially hazardous asteroid (PHA) in the Apollo group, about 1 km in diameter. It is a dark Cg-type asteroid with features of both C-type and G-type asteroids. Discovered by the Lincoln Near-Earth Asteroid Research (LINEAR) team in 1999, Ryugu was visited by JAXA's Hayabusa 2 spacecraft in June 2018 to collect surface samples.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "53319": { 
        tag:"53319", 
        size: 7 * nEOScale, 
        smA: -2.724 * distanceScaleFactor, 
        oE: 0.6414, 
        color: 0xa9a9a9, 
        rotationPeriod: 5.9875, 
        period: 1638.85, 
        inclination: 13.84,
        nextcloseapproach: "2038-Feb-27 18:27 ± < 00:01, 1.46847 AU",
        closestapproach: "1990-Aug-08 09:55 ± < 00:01, 0.03348 AU",
        classification: "Apollo",
        desc: "53319 is the largest known potentially hazardous asteroid, with a diameter of approximately 7 km. Discovered by the (LINEAR) team in 1999, 53319 is a slow-rotating asteroid classified as an NEO and PHA within the Apollo group.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "4015 Wilson-Harrington": { 
        tag:"4015 Wilson-Harrington", 
        size: 4 * nEOScale, 
        smA: 2.626 * distanceScaleFactor, 
        oE: 0.6312, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.1489, 
        period: 1551.25, 
        inclination: 2.8,
        nextcloseapproach: "2039-Oct-31 09:05 ± < 00:01, 0.10829",
        closestapproach: "1919-Sep-30 06:08 ± < 00:01, 0.05254 AU",
        classification: "Apollo",
        desc: "Wilson-Harrington is both a near-Earth asteroid and potentially hazardous asteroid, as well as a comet (107P/Wilson-Harrington). It was first discovered as a comet in 1949 by Albert Wilson and Robert Harrington. It showed cometary activity only once, later being rediscovered in 1979 as an asteroid by Eleanor Helin.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "1981 Midas": { 
        tag:"1981 Midas", 
        size: 3.4 * nEOScale, 
        smA: 1.776 * distanceScaleFactor, 
        oE: 0.6505, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.2175, 
        period: 865.05, 
        inclination: 39.82,
        nextcloseapproach: "2032-Sep-14 14:57 ± < 00:01, 0.08635 AU",
        closestapproach: "1947-Mar-19 20:13 ± < 00:01, 0.02979 AU",
        classification: "Apollo",
        desc: "Midas is a near-Earth object and PHA, approximately 2 km in diameter. It was discovered in 1973 by American astronomer Charles Kowal at Palomar Observatory. This asteroid, named after King Midas from Greek mythology, follows a highly elliptical orbit close to Earth's path.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "4183 Cuno": { 
        tag:"4183 Cuno", 
        size: 3.651 * nEOScale, 
        smA: -1.981 * distanceScaleFactor, 
        oE: 0.6361, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.1483125, 
        period: 1018.35, 
        inclination: 6.67,
        nextcloseapproach: "2026-Apr-04 15:19 ± < 00:01, 0.27493 AU",
        closestapproach: "2146-Jan-08 00:12 ± < 00:01, 0.06110 AU",
        classification: "Apollo",
        desc: "Cuno, an eccentric NEO and PHA from the Apollo group, is a rare-type asteroid measuring about 4 km in diameter. It was discovered by German astronomer Cuno Hoffmeister in 1959 at Boyden Observatory in South Africa, and the asteroid was later named in his honor.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "12923 Zephyr": { 
        tag:"12923 Zephyr", 
        size: 2.06 * nEOScale, 
        smA: 1.963 * distanceScaleFactor, 
        oE: 0.4918, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.16220833, 
        period: 1003.75, 
        inclination: 5.3,
        nextcloseapproach: "2032-Sep-22 21:13 ± < 00:01, 0.18602 AU",
        closestapproach: "2032-Sep-22 21:13 ± < 00:01, 0.18602 AU",
        classification: "Apollo",
        desc: "Zephyr is a stony near-Earth object and PHA of the Apollo group, approximately 2 km in diameter. It was discovered in 1999 by the Lowell Observatory Near-Earth Object Search (LONEOS) team. The asteroid is named after Zephyrus, the Greek god of the west wind.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "66391 Moshup": { 
        tag:"66391s Moshup", 
        size: 1.317 * nEOScale, 
        smA: -0.6424 * distanceScaleFactor, 
        oE: 0.6884, 
        color: 0xa9a9a9, 
        rotationPeriod: 0.1151875, 
        period: 187.975, 
        inclination: 38.88,
        nextcloseapproach: "2031-Jun-06 15:51 ± < 00:01, 0.45612 AU",
        closestapproach: "2124-May-26 20:15 ± < 00:01, 0.01410 AU",
        classification: "Aten",
        desc: "Moshup is a binary asteroid classified as a near-Earth object and potentially hazardous asteroid in the Aten group. It was discovered in 1999 by the Lincoln Near-Earth Asteroid Research (LINEAR) team and features a primary object about 1.3 km in diameter, along with a companion moonlet.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "3362 Khufu": { 
        tag:"3362 Khufu", 
        size: 0.7 * nEOScale, 
        smA: 0.9895 * distanceScaleFactor, 
        oE: 0.4685, 
        color: 0xa9a9a9, 
        rotationPeriod: 0, 
        period: 359.16, 
        inclination: 9.92, 
        nextcloseapproach: "2031-Jun-06 15:51 ± < 00:01, 0.45612 AU",
        closestapproach: "2124-May-26 20:15 ± < 00:01, 0.01410 AU",
        classification: "Aten",
        desc: "Khufu, an NEO and PHA in the Aten group, is about 0.7 km in diameter. It was discovered by R. Scott Dunbar and Maria A. Barucci at Palomar Observatory in 1984. The asteroid, which crosses Earth’s orbit, was named after the ancient Egyptian pharaoh Khufu.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "99942 Apophis": { 
        tag:"99942 Apophis", 
        size: 0.34 * nEOScale, 
        smA: -0.9224 * distanceScaleFactor, 
        oE: 0.1911, 
        color: 0xa9a9a9, 
        rotationPeriod: 1.2733333, 
        period: 323.39, 
        inclination: 3.34,
        nextcloseapproach: "2031-Jun-06 15:51 ± < 00:01, 0.45612 AU",
        closestapproach: "2124-May-26 20:15 ± < 00:01, 0.01410 AU",
        classification: "Aten",
        desc: "Apophis is a near-Earth asteroid and potentially hazardous asteroid, estimated to be about 335 meters in diameter. Discovered in 2004 by astronomers at the Kitt Peak National Observatory, Apophis was initially considered one of the most hazardous objects but has since been determined to pose no risk of Earth impact for at least the next century.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null 
    },
    "1036 Ganymed": {
        tag: "1036 Ganymed",
        size: 37.675 * nEOScale,
        smA: 2.665 * distanceScaleFactor,
        oE: 0.5328,
        color: 0xa9a9a9,
        rotationPeriod: 10.297,
        period: 1587.75,
        inclination: 26.69,
        nextcloseapproach: "2024-Oct-13 01:56 ± < 00:01, 0.37410 AU",
        closestapproach: "2011-Oct-13 00:04 ± < 00:01, 0.35910 AU",
        classification: "Amor",
        desc: "Ganymed is a stony asteroid classified as a near-Earth object in the Amor group. Discovered in 1924 by German astronomer Walter Baade, Ganymed is the largest near-Earth asteroid, approximately 37.7 km in diameter. It has a highly eccentric orbit but does not cross Earth's orbit.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null
    },
    // "3552 Don Quixote": {
    //     tag: "3552 Don Quixote",
    //     size: 19 * nEOScale,
    //     smA: 4.267 * distanceScaleFactor,
    //     oE: 0.7073,
    //     color: 0xa9a9a9,
    //     rotationPeriod: 6.665,
    //     period: 8.81,  
    //     inclination: 31.06,
    //     nextcloseapproach: "2053-Aug-26 04:18 ± < 00:01, 0.44935 AU",
    //     closestapproach: "1922-Sep-01 23:06 ± < 00:01, 0.30002 AU",
    //     classification: "Amor",
    //     desc: "Don Quixote is a large, elongated asteroid classified as a near-Earth object in the Amor group. It was discovered in 1983 and is thought to have originated from the Kuiper Belt. With an eccentric orbit, it is considered a Damocloid-type asteroid.",
    //     center: new THREE.Vector3(0, 0, 0),
    //     texturePath: null
    // },
    "433 Eros": {
        tag: "433 Eros",
        size: 16.84 * nEOScale,
        smA: 1.458 * distanceScaleFactor,
        oE: 0.2227,
        color: 0xa9a9a9,
        rotationPeriod: 5.27,
        period: 642.4, 
        inclination: 10.83,
        nextcloseapproach: "2025-Nov-30 02:18 ± < 00:01, 0.39765 AU",
        closestapproach: "2137-Jan-25 14:12 ± < 00:01, 0.14946 AU",
        classification: "Amor",
        desc: "Eros is the second-largest near-Earth asteroid and the first to be orbited by a spacecraft (NEAR Shoemaker). It has a peanut-like shape and is one of the most thoroughly studied near-Earth asteroids, with a highly elliptical orbit and a size of approximately 16.84 km.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null
    },
    "4954 Eric": {
        tag: "4954 Eric",
        size: 10.8 * nEOScale,
        smA: 2.001 * distanceScaleFactor,
        oE: 0.4494,
        color: 0xa9a9a9,
        rotationPeriod: 12.056,
        period: 1032.95, 
        inclination: 17.43,
        nextcloseapproach: "2024-Oct-11 05:00 ± < 00:01, 0.24254 AU",
        closestapproach: "2058-Oct-11 08:27 ± < 00:01, 0.20665 AU",
        classification: "Amor",
        desc: "Eric is a near-Earth asteroid classified in the Amor group. Discovered on 23 September 1990 by American astronomer Brian Roman at Palomar Observatory, it is named after Roman's son, Eric. This eccentric, stony asteroid measures about 10.8 km in diameter and orbits Earth at a close distance.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null
    },

    "1627 Ivar": {
        tag: "1627 Ivar",
        size: 9.12 * nEOScale,
        smA: 1.863 * distanceScaleFactor,
        oE: 0.397,
        color: 0xa9a9a9,
        rotationPeriod: 4.795,
        period: 927.1, 
        inclination: 8.45,
        nextcloseapproach: "2041-Jun-29 06:58 ± < 00:01, 0.43530 AU",
        closestapproach: "2074-Aug-03 16:48 ± < 00:01, 0.14074 AU",
        classification: "Apollo",
        desc: "Ivar is a stony, elongated near-Earth asteroid in the Apollo group, discovered on 25 September 1929 by Danish astronomer Ejnar Hertzsprung at Leiden Southern Station. Named after Hertzsprung’s brother, Ivar, this asteroid was the first to be imaged by radar, in 1985, by Arecibo Observatory. Its size is approximately 9.1 km, and it follows a highly eccentric orbit.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null
    },

}

const nearearthcomets = {
    // "109P/Swift-Tuttle": {
    //     tag: "109P/Swift-Tuttle",
    //     size: 26 * nEOScale,
    //     smA: 26.0920694978266 * distanceScaleFactor,
    //     oE: 0.963225755,
    //     color: 0xa9a9a9,
    //     rotationPeriod: null, // Not specified
    //     period: 133.28, 
    //     inclination: 113.453817,
    //     nextcloseapproach: "2126-Aug-05 15:50 ± 00:01, 0.15337 AU",
    //     closestapproach: "2126-Aug-05 15:50 ± 00:01, 0.15337 AU",
    //     classification: "Halley-type Comet [NEO]",
    //     desc: "Comet Swift-Tuttle was discovered in 1862 independently by Lewis Swift and Horace Tuttle. It takes 133 years to orbit the Sun once. Swift-Tuttle last reached perihelion in 1992 and will return again in 2125. It is a large comet with a nucleus 16 miles across. The Perseids meteor shower originates from Swift-Tuttle’s debris.",
    //     center: new THREE.Vector3(0, 0, 0),
    //     texturePath: null
    // },

    // "1P/Halley": {
    //     tag: "1P/Halley",
    //     size: 11 * nEOScale,
    //     smA: 17.93003431157555 * distanceScaleFactor,
    //     oE: 0.9671429085,
    //     color: 0xa9a9a9,
    //     rotationPeriod: null, // Not specified
    //     period: 75.32, 
    //     inclination: 162.2626906,
    //     nextcloseapproach: "2126-Aug-05 15:50 ± 00:01, 0.15337 AU",
    //     closestapproach: "2126-Aug-05 15:50 ± 00:01, 0.15337 AU",
    //     classification: "Halley-type Comet [NEO]",
    //     desc: "Halley's Comet is one of the most famous comets, returning to Earth's vicinity every 75 years. It was last here in 1986 and will return in 2061. Named after Edmond Halley, who predicted its return in 1758, it is the source of several historic sightings, making it a significant part of astronomical history.",
    //     center: new THREE.Vector3(0, 0, 0),
    //     texturePath: null
    // },

    // "2P/Encke": {
    //     tag: "2P/Encke",
    //     size: 6.4 * nEOScale,
    //     smA: 2.219588160856368 * distanceScaleFactor,
    //     oE: 0.8482682514,
    //     color: 0xa9a9a9,
    //     rotationPeriod: null, // Not specified
    //     period: 3.3, 
    //     inclination: 11.77999525,
    //     nextcloseapproach: "2030-Jul-11 13:31 ± 00:18, 0.27442 AU",
    //     closestapproach: "2172-Jun-30 15:10 ± 1_19:51, 0.15839 AU",
    //     classification: "Encke-type Comet [NEO]",
    //     desc: "Discovered by Pierre F. A. Mechain in 1786, comet Encke was identified as the same comet by Johann Franz Encke. It has the shortest known orbital period, 3.30 years, and a small nucleus of about 2.98 miles in diameter. It is the parent of the Taurid meteor shower, famous for its fireballs during October/November.",
    //     center: new THREE.Vector3(0, 0, 0),
    //     texturePath: null
    // },

    "67P/Churyumov-Gerasimenko": {
        tag: "67P/Churyumov-Gerasimenko",
        size: 5.2 * nEOScale,
        smA: 3.462249489765068 * distanceScaleFactor,
        oE: 0.6409739314,
        color: 0xa9a9a9,
        rotationPeriod: null, // Not specified
        period: 6.44, 
        inclination: 7.040200902,
        nextcloseapproach: "2034-Nov-28 23:42 ± 00:01, 0.45165 AU",
        closestapproach: "1982-Nov-27 14:19 ± 00:01, 0.39091 AU",
        classification: "Jupiter-family Comet [NEO]",
        desc: "Discovered in 1969, this comet made history when the Rosetta spacecraft orbited and landed on it in 2014. Its orbit crosses those of Jupiter and Mars, and it is thought to have originated from the Kuiper Belt. Rosetta's mission with this comet ended with a controlled impact on its surface in 2016.",
        center: new THREE.Vector3(0, 0, 0),
        texturePath: null
    },

    // "8P/Tuttle": {
    //     tag: "8P/Tuttle",
    //     size: 4.8 * nEOScale,
    //     smA: 5.700291361749948 * distanceScaleFactor,
    //     oE: 0.819799747,
    //     color: 0xa9a9a9,
    //     rotationPeriod: null, // Not specified
    //     period: 13.61, 
    //     inclination: 54.98318484,
    //     nextcloseapproach: "2034-Nov-28 23:42 ± 00:01, 0.45165 AU",
    //     closestapproach: "1982-Nov-27 14:19 ± 00:01, 0.39091 AU",
    //     classification: "Jupiter-family Comet [NEO]",
    //     desc: "A mid-sized comet discovered independently by multiple astronomers, its orbit is influenced by Jupiter's gravity. It orbits the sun every 13.61 years and has been classified as a 'Near Earth Asteroid' due to its proximity. At around 4.5 kilometers in diameter, it is larger than most asteroids.",
    //     center: new THREE.Vector3(0, 0, 0),
    //     texturePath: null
    // },
}

export {planetParams, satelliteParams, nearEarthObjects, nearearthcomets}
