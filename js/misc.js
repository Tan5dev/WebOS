// Wallpaper
const desktop = document.getElementById("desktop");
const savedWallpaper = localStorage.getItem("customWallpaper");
desktop.style.backgroundImage = savedWallpaper ? `url(${savedWallpaper})` : "url('assets/wallpaper.jpeg')";

// Clock
function updateClock() {
const now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

let ampm = "AM";
if(hours >= 12){
hours -= 12;
ampm = "PM";
} 
if(hours == 0){
hours = 12;
}

minutes = minutes.toString().padStart(2, '0');
seconds = seconds.toString().padStart(2, '0');

document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);

// Boot screen fade out
setTimeout (() => {
const bootScreen = document.getElementById("boot-screen");
if(bootScreen) {
bootScreen.remove();
}
}, 3500);



(function() {
    const iconIds = ["notepad-icon", "terminal-icon", "browser-icon", "minesweeper-icon"];
    const icons = iconIds.map(id => document.getElementById(id)).filter(Boolean);

    let draggedIcon = null;
    let offsetX = 0, offsetY = 0;
    let startX = 0, startY = 0;
    let hasDragged = false;
    const DRAG_THRESHOLD = 5;

    icons.forEach(icon => {
        icon.addEventListener("mousedown", (e) => {
            draggedIcon = icon;
            hasDragged = false;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;
        });
    });

    icons.forEach(icon => {
        const img = icon.querySelector("img");
        if(img) img.draggable = false;
        icon.addEventListener("dragstart", (e) => e.preventDefault());
    });

    const GRID_SIZE = 100;
    const GRID_OFFSET = 20;

    function snapToGrid(value){
        return Math.round((value - GRID_OFFSET) / GRID_SIZE) * GRID_SIZE + GRID_OFFSET;
    }

    document.addEventListener("mousemove", (e) => {
        if(!draggedIcon || e.buttons !== 1) return;
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) hasDragged = true;
        if(hasDragged){
            draggedIcon.style.left = (e.clientX - offsetX) + "px";
            draggedIcon.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if(draggedIcon && hasDragged) {
            draggedIcon.style.left = snapToGrid(draggedIcon.offsetLeft) + "px";
            draggedIcon.style.top = snapToGrid(draggedIcon.offsetTop) + "px";
            saveIconPositions();
        }
        draggedIcon = null;
    });

    document.addEventListener("click", (e) => {
        if(hasDragged) {
            e.stopPropagation();
            e.preventDefault();
            hasDragged = false;
        }
    }, true);

    function saveIconPositions() {
        const positions = {};
        icons.forEach(icon => {
            positions[icon.id] = { top: icon.style.top, left: icon.style.left };
        });
        localStorage.setItem("iconPositions", JSON.stringify(positions));
    }

    function loadIconPositions() {
        const saved = localStorage.getItem("iconPositions");
        if (!saved) return;0
        const positions = JSON.parse(saved);
        icons.forEach(icon => {
            if (positions[icon.id]) {
                icon.style.top = positions[icon.id].top;
                icon.style.left = positions[icon.id].left;
            }
        });
    }

    loadIconPositions();
})();

(function() {
    const wallpaperMenu = document.createElement("div");
    wallpaperMenu.id = "wallpaper-menu";
    wallpaperMenu.style.cssText = "position:absolute; display:none; background:rgba(20,20,20,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:4px; padding:5px 0; z-index:99999; font-family:sans-serif; font-size:14px; color:white;";

    const changeWallpaperOption = document.createElement("div");
    changeWallpaperOption.textContent = "Change Wallpaper";
    changeWallpaperOption.style.cssText = "padding:8px 15px; cursor:pointer;";
    changeWallpaperOption.addEventListener("mouseenter", () => changeWallpaperOption.style.background = "rgba(255,255,255,0.1)");
    changeWallpaperOption.addEventListener("mouseleave", () => changeWallpaperOption.style.background = "none");

    wallpaperMenu.appendChild(changeWallpaperOption);
    document.body.appendChild(wallpaperMenu);

    const wallpaperInput = document.createElement("input");
    wallpaperInput.type = "file";
    wallpaperInput.accept = "image/*";
    wallpaperInput.style.display = "none";
    document.body.appendChild(wallpaperInput);

    desktop.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        wallpaperMenu.style.top = e.pageY + "px";
        wallpaperMenu.style.left = e.pageX + "px";
        wallpaperMenu.style.display = "block";
    });

    document.addEventListener("click", (e) => {
        if(!wallpaperMenu.contains(e.target)) wallpaperMenu.style.display = "none";
    });

    changeWallpaperOption.addEventListener("click", () => {
        wallpaperInput.click();
        wallpaperMenu.style.display = "none";
    })
    
    wallpaperInput.addEventListener("change", () => {
        const file = wallpaperInput.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            desktop.style.backgroundImage = `url('${reader.result}')`;
            localStorage.setItem("customWallpaper", reader.result);
        };
        reader.readAsDataURL(file);
    });
})();