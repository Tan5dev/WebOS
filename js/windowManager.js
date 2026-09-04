(function() {
    let offsetX = 0, offsetY = 0;
    let isDragging = false;
    let activeWindow = null;
    let topZIndex = 1000;
    
    let preSnapState = null;

    window.bringToFront = (el) => { topZIndex++; el.style.zIndex = topZIndex; };

    const attachDrag = (winId, barId) => {
        const bar = document.getElementById(barId);
        const win = document.getElementById(winId);
        if(!bar || !win) return;
        
        bar.addEventListener("mousedown", (e) => {
            if (e.target.closest("button")) return;
            
            isDragging = true;
            activeWindow = win;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            
            if(win.classList.contains("snapped") || win.classList.contains("maximized")){
                win.classList.remove("snapped", "maximized");
                taskbar.classList.remove("solid");
                win.style.width = preSnapState.width;
                win.style.height = preSnapState.height;
            } else{
                preSnapState = {
                    width:win.style.width,
                    height:win.style.height
                };
            }
            
            window.bringToFront(win);
        });
    };

    attachDrag("notepad-window", "notepad-titleBar");
    attachDrag("terminal-window", "terminal-titleBar");
    attachDrag("minesweeper-window", "minesweeper-titleBar");
    attachDrag("browser-window", "browser-titleBar");
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging || !activeWindow) return;

        const snapThreshold = 20;
        const screenWidth = window.innerWidth;

        if (e.clientY < snapThreshold) { 
            activeWindow.style.width = "100vw";
            activeWindow.style.height = "calc(100vh - 50px)";
            activeWindow.style.left = "0px";
            activeWindow.style.top = "0px";
            activeWindow.classList.add("maximized");
            taskbar.classList.add("solid");
        } else if (e.clientX < snapThreshold) {
            activeWindow.style.width = "50vw";
            activeWindow.style.height = "calc(100vh - 50px)";
            activeWindow.style.left = "0px";
            activeWindow.style.top = "0px";
            activeWindow.classList.add("snapped");
        } else if (e.clientX > screenWidth - snapThreshold) { 
            activeWindow.style.width = "50vw";
            activeWindow.style.height = "calc(100vh - 50px)";
            activeWindow.style.left = "50vw";
            activeWindow.style.top = "0px";
            activeWindow.classList.add("snapped");
        } else {
            if (activeWindow.classList.contains("snapped") || activeWindow.classList.contains("maximized")) {
                activeWindow.classList.remove("snapped", "maximized");
                taskbar.classList.remove("solid");
                activeWindow.style.width = preSnapState.width;
                activeWindow.style.height = preSnapState.height;
                offsetX = activeWindow.offsetWidth / 2; 
            }
            
            activeWindow.style.left = `${e.clientX - offsetX}px`;
            activeWindow.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        activeWindow = null;
    });

    const focusWindow = function(windowElement) {
        if (windowElement.style.display === "none") {
            windowElement.style.display = "flex";
        }
        topZIndex++;
        windowElement.style.zIndex = topZIndex;
    };

    window.focusWindow = focusWindow;
    window.bringToFront = (element) => {
        topZIndex++;
        element.style.zIndex = topZIndex;
    };
    window.removeFromTaskbar = (id) => {
        const item = document.getElementById(id);
        if (item) item.remove();
    };

})();