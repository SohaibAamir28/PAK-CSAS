const toggleButton = document.querySelectorAll(".category-toggle");

toggleButton.forEach((e) => {
    e.addEventListener("click", () => {
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

var side_open = false;

function slide() {
    const sidebar = document.querySelector('.sidebar');
    
    if (!side_open) {
        sidebar.classList.add('visible'); 
    } else {
        sidebar.classList.remove('visible'); 
    }
    
    side_open = !side_open; 
}

window.slide = slide