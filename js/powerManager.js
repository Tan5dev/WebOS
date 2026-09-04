// Power menu functionality
const powerButton = document.getElementById("power-button");
const powerMenu = document.getElementById("power-menu");

powerButton.addEventListener("click", () => {
    powerMenu.style.display = 
        powerMenu.style.display === "block"
            ? "none"
            : "block";
});

document.addEventListener("click", (e) =>{
    if(!powerButton.contains(e.target) && !powerMenu.contains(e.target)) {
        powerMenu.style.display = "none";
    }
});

const restartOption = document.querySelector(".power-option:last-child");
const powerOffOption = document.querySelector(".power-option:first-child");

restartOption.addEventListener("click", () => {
    window.location.reload();
});

powerOffOption.addEventListener("click", () =>{
    window.close();
    alert("Shutdown. (window close failed)");
});
