var TextVisible = true;
function EnableText() {
  const Labels = document.getElementsByClassName("PlanetLabels")
  if (TextVisible === true) {
    TextVisible = false;
    for (const Label in Labels) {
      try {
        Labels[Label].style.opacity = "0"
      }
      catch {
        return
      }
    }
  }
  if (TextVisible === false) {
    TextVisible = true
    for (const Label in Labels) {
      try {
        Labels[Label].style.opacity = "1"
      }
      catch {
        return
      }
    }
  }
}


function changeSpeed(value) {
  timeScale = value
  document.getElementById('sliderValue').value = value 
}

export let timeScale = 1

window.changeSpeed = changeSpeed
window.EnableText = EnableText

const startBtn = document.querySelector(".startbtn")
const containerIntro = document.querySelector(".container-intro")

startBtn.addEventListener("click", ()=>{
  containerIntro.classList.add("fade-out");
  setTimeout(() => {
    containerIntro.style.visibility = "hidden";
  }, 1500);
})