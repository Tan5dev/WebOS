(function() {

    // Notepad functionality
    const notepadIcon = document.getElementById("notepad-icon");
    const notepadWindow = document.getElementById("notepad-window");

    notepadIcon.addEventListener("click", () => {
        notepadWindow.style.width = "600px";
        notepadWindow.style.height = "400px";
        notepadWindow.style.top = "50px";
        notepadWindow.style.left = "100px";
        notepadWindow.classList.remove("maximized");
        isMaximized = false;
        notepadWindow.style.display = "flex";
        window.focusWindow(notepadWindow);
        addToTaskbar();
    });

    // Taskbar icon functions
    function addToTaskbar() {
        const taskbarItems = document.getElementById("taskbar-items");
        if (document.getElementById("taskbar-notepad")) return; 

        const item = document.createElement("button");
        item.id = "taskbar-notepad";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/notepad-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";
        
        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54, 52, 52, 0.1)";
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255, 255, 255, 0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.borderRadius = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if (notepadWindow.style.display === "none") {
                notepadWindow.style.display = "flex";
                window.focusWindow(notepadWindow);
                if(isMaximized) taskbar.classList.add("solid");
            } else {
                notepadWindow.style.display = "none";
                if(isMaximized) taskbar.classList.remove("solid");
            }
        });

        item.appendChild(img);
        taskbarItems.appendChild(item);
    }

    document.getElementById("close-btn").addEventListener("click", () => {
            notepadWindow.style.display = "none";
            window.removeFromTaskbar("taskbar-notepad"); // Call the global one
        });
    window.openNotepad = () => {
            notepadWindow.style.display = "flex";
        };
    document.getElementById("max-btn").addEventListener("click", () => {
        const taskbar = document.getElementById("taskbar");
        
        if (!isMaximized) {
            preMaximizedStyle = {
                top: notepadWindow.style.top,
                left: notepadWindow.style.left,
                width: notepadWindow.style.width,
                height: notepadWindow.style.height
            };

            notepadWindow.style.width = "100vw";
            notepadWindow.style.height = "calc(100vh - 50px)";
            notepadWindow.style.left  = "0";
            notepadWindow.style.top = "0";
            notepadWindow.style.display = "flex";
            notepadWindow.classList.add("maximized");
            taskbar.classList.add("solid");
            isMaximized = true;
        } else {
            notepadWindow.classList.remove("maximized");
            notepadWindow.style.top = preMaximizedStyle.top;
            notepadWindow.style.left = preMaximizedStyle.left;
            notepadWindow.style.width = preMaximizedStyle.width;
            notepadWindow.style.height = preMaximizedStyle.height;
            
            taskbar.classList.remove("solid");
            isMaximized = false;
        }
    });

    document.getElementById("min-btn").addEventListener("click", () => {
        notepadWindow.style.display = "none";
        const taskbar = document.getElementById("taskbar");
        if (isMaximized) {
            taskbar.classList.remove("solid");
        }
    });

    notepadWindow.addEventListener("mousedown", () => {
        window.bringToFront(notepadWindow);
    });
})();