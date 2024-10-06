const toggleButton = document.querySelectorAll(".category-toggle");

toggleButton.forEach((e) => {
    e.addEventListener("click", () => {
        // Toggle the class for the individual element 'e'
        if (e.classList.contains("on")) {
            e.classList.remove("on");
            e.classList.add("off");
            e.setAttribute("status", "off")
            e.textContent = "Off";
        } else {
            e.classList.remove("off");
            e.classList.add("on");
            e.setAttribute("status", "on")
            e.textContent = "On";
        }
    });
});

var side_open = false; // Sidebar is initially closed

function slide() {
    const sidebar = document.querySelector('.sidebar');
    
    if (!side_open) {
        sidebar.classList.add('visible'); // Show the sidebar
    } else {
        sidebar.classList.remove('visible'); // Hide the sidebar
    }
    
    side_open = !side_open; // Toggle state
}

/*const info_bar = document.querySelector(".information")
const dummy = document.querySelector(".dummy-planet")

let planets = [dummy]
let info_open = false

planets.forEach((e)=>{
    e.addEventListener("click", ()=>{
        if (!info_open)
            info_bar.classList.add("visible")
        else{
            info_bar.classList.remove("visible")
        }
        info_open = !info_open;
    })
})*/

const info_bar = document.querySelector(".information")
const dummy = document.querySelector(".dummy-planet")
var info_open = false

dummy.addEventListener("click", ()=>{
    if (!info_open)
        info_bar.classList.add("visible")
    else{
        info_bar.classList.remove("visible")
    }
    info_open = !info_open;
})