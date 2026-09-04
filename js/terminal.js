(function() {
// Terminal window management
const terminalWindow = document.getElementById("terminal-window");
const terminalIcon = document.getElementById("terminal-icon");
const terminalTitleBar = document.getElementById("terminal-titleBar");
const terminalMinBtn = document.getElementById("terminal-min-btn");
const terminalMaxBtn = document.getElementById("terminal-max-btn");
const terminalCloseBtn = document.getElementById("terminal-close-btn");

let terminalMaximized = false;
let terminalPrevState  = {
    width: terminalWindow.style.width,
    height: terminalWindow.style.height,
    left: terminalWindow.style.left,
    top: terminalWindow.style.top
}

terminalIcon.addEventListener("click", () => {
    terminalWindow.style.width = "600px";
    terminalWindow.style.height = "400px";
    terminalWindow.style.top = "100px";
    terminalWindow.style.left = "150px";
    terminalWindow.classList.remove("maximized");
    terminalMaximized = false;
    terminalWindow.style.display = "flex";
    window.focusWindow(terminalWindow);
    addTerminalToTaskbar();
});

terminalCloseBtn.addEventListener("click", () => {
    terminalWindow.style.display = "none";
    if(terminalMaximized){
        taskbar.classList.remove("solid");
        terminalMaximized = false;
    }
    terminalWindow.style.display = "none";
    removeTerminalFromTaskbar();
});

terminalMinBtn.addEventListener("click", () => {
    terminalWindow.style.display = "none";
    if(!document.getElementById("taskbar-terminal")) addTerminalToTaskbar();
});

terminalMaxBtn.addEventListener("click", () => {
    if(!terminalMaximized){
        terminalPrevState  = {
            width: terminalWindow.style.width,
            height: terminalWindow.style.height,
            left: terminalWindow.style.left,
            top: terminalWindow.style.top
        };
        terminalWindow.style.width = "100vw";
        terminalWindow.style.height = "calc(100vh - 50px)";
        terminalWindow.style.left  = "0";
        terminalWindow.style.top = "0";
        terminalWindow.style.display = "flex";

        terminalWindow.classList.add("maximized");
        taskbar.classList.add("solid");
    }
    else{
        terminalWindow.style.width=terminalPrevState.width;
        terminalWindow.style.height=terminalPrevState.height;
        terminalWindow.style.left=terminalPrevState.left;
        terminalWindow.style.top=terminalPrevState.top;
        terminalWindow.style.display = "flex";
        terminalWindow.classList.remove("maximized");
        taskbar.classList.remove("solid");
    }
    terminalMaximized = !terminalMaximized;
});

// Terminal taskbar management
function addTerminalToTaskbar() {
    const taskbarItems = document.getElementById("taskbar-items");
    if(document.getElementById("taskbar-terminal")) return;

    const item = document.createElement("button");
    item.id = "taskbar-terminal";
    item.style.cursor = "pointer";
    item.style.background = "none";
    item.style.border = "none";
    item.style.padding = "0";
    item.style.margin = "0 5px";

    const img = document.createElement("img");
    img.src="assets/terminal-icon.png";
    img.style.width="40px";
    img.style.height="40px";

    item.addEventListener("mouseenter", () => {
        item.style.background = "rgba(54,52,52,0.1)";
        item.style.borderRadius = "4px";
        item.style.border = "1px solid rgba(255,255,255,0.2)";
    });

    item.addEventListener("click", () => {
        if(terminalWindow.style.display === "none"){
            terminalWindow.style.display = "flex";
            window.focusWindow(terminalWindow);
            if(terminalMaximized) taskbar.classList.add("solid");
        } else {
            terminalWindow.style.display = "none";
            if(terminalMaximized) taskbar.classList.remove("solid");
        }
    });

    item.addEventListener("mouseleave", () => {
        item.style.background = "none";
        item.style.border = "none";
    })

    item.appendChild(img);
    taskbarItems.appendChild(item);
}

function removeTerminalFromTaskbar(){
    const item = document.getElementById("taskbar-terminal");
    if(item)item.remove();
}

// Terminal functionality
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const terminalContent = document.getElementById("terminal-content");

let terminalHasRunOnce = false;

terminalInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const command = terminalInput.value.trim();

    if (!terminalHasRunOnce) {
        terminalInput.placeholder = "";
        terminalHasRunOnce = true;
    }

    const commandLine = document.createElement("div");
    commandLine.textContent = `user@GenericOS~:$ ${command}`;
    terminalOutput.appendChild(commandLine);

    const responseLine = document.createElement("div");
    if (commands[command]) {
        responseLine.innerHTML = commands[command];
    } else {
        responseLine.textContent = "Command not found, run 'help' for a list of commands";
    }
    terminalOutput.appendChild(responseLine);
    
    terminalInput.value = "";
    terminalContent.scrollTop = terminalContent.scrollHeight;
});

terminalWindow.addEventListener("mousedown", () => {
    window.bringToFront(terminalWindow);
});

})();