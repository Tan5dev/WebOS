(function() {
    const apps =[
        { name: "Notepad", icon: "assets/notepad-icon.png", targetId: "notepad-icon" },
        { name: "Terminal", icon: "assets/terminal-icon.png", targetId: "terminal-icon" },
        { name: "Web Browser", icon: "assets/browser-icon.png", targetId: "browser-icon" },
        { name: "Minesweeper", icon: "assets/minesweeper-icon.png", targetId: "minesweeper-icon" }
    ];

    const startButton = document.getElementById("os-text");
    if(!startButton) return;
    startButton.style.cursor = "pointer";

    const startMenu = document.createElement("div");
    startMenu.id = "start-menu";
    startMenu.style.dispay = "none";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "start-menu-search";
    searchInput.placeholder = "Search apps or the web...";
    startMenu.appendChild(resultsList);

    const resultsList = document.getElementById("div");
    resultsList.id = "start-menu-results";
    startMenu.appendChild(resultsList);

    document.body.appendChild(startMenu);

    let filteredApps = [];

    function renderResults(query){
        resultsList.innerHTML = "";
        const q = query.trim().toLowerCase();
        filteredApps = q === "" ? apps : apps.filter(app => app.name.toLowerCase().includes(q));

        filteredApps.forEach((app, index) => {
            const item = document.createElement("div");
            item.className = "start-meny-item";
            if(index === 0) item.classList.add("selected");

            const img = document.createElement("img");
            img.src = app.icon;
            item.appendChild(img);

            const label = document.createElement("span");
            label.textContent = app.name;
            item.appendChild(label);

            item.addEventListener("click", () => launchApp(app));
            resultsList.appendChild(item);
        });
                
        if(filteredApps.length === 0 && q !== "") {
            const item = document.createElement("div");
            item.className = "start-menu-item start-menu-search-web";
            item.textContent = `Search the web for "${query}"`;
            item.addEventListener("click", () => searchWeb(query));
            resultsList.appendChild(item);
        }
    }

    function launchApp(app) {
        const icon = document.getElementById(app.targetId);
        if(icon) icon.click();
        closeStartMenu();
    }

    function searchWeb(query) {
        const browserIcon = document.getElementById("browser-icon");
        if(browserIcon) browserIcon.click();

        setTimeout(() => {
            const urlInput = document.getElementById("browser-url");
            const goBtn = document.getElementById("browser-go-btn");
            if(urlInput && goBtn){
                urlInput.value = "https://www.google.com/search?q=" + encodeURIComponent(query);
                goBtn.click();
            }
        }, 100);

        closeStartMenu();
    }

    function openStartMenu() {
        startMenu.style.display = "flex";
        searchInput.value = "";
        renderResults("");
        searchInput.focus();
    }

    function closeStartMenu() {
        startMenu.style.display = "none";
    }

    function toggleStartMenu() {
        if(startMenu.style.display === "flex") {
            closeStartMenu();
        } else {
            openStartMenu();
        }
    }
        
})