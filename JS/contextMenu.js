export function initializeContextMenu(svg, main, data) {
    const menu = document.createElement("div");
    menu.id = "contextMenu";
    menu.style.position = "absolute";
    menu.style.display = "none";
    menu.style.backgroundColor = "#fff";
    menu.style.border = "1px solid #ccc";
    menu.style.padding = "5px";
    menu.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(menu);

    // Cria a div para exibir a foto no container
    const photoOverlay = document.createElement("div");
    photoOverlay.className = "photo-overlay";
    photoOverlay.style.position = "fixed";
    photoOverlay.style.top = "0";
    photoOverlay.style.left = "0";
    photoOverlay.style.width = "100%";
    photoOverlay.style.height = "100%";
    photoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    photoOverlay.style.display = "none";
    photoOverlay.style.justifyContent = "center";
    photoOverlay.style.alignItems = "center";
    photoOverlay.style.zIndex = "1000";

    const photoContainer = document.createElement("div");
    photoContainer.className = "photo-container";

    const img = document.createElement("img");
    img.style.maxWidth = "90vw";
    img.style.maxHeight = "90vh";

    const closePhotoButton = document.createElement("button");
    closePhotoButton.innerHTML = "Fechar";
    closePhotoButton.className = "close-button";
    closePhotoButton.style.position = "absolute";
    closePhotoButton.style.top = "10px";
    closePhotoButton.style.right = "10px";
    closePhotoButton.style.backgroundColor = "#ff5c5c";
    closePhotoButton.style.border = "none";
    closePhotoButton.style.color = "white";
    closePhotoButton.style.padding = "10px";
    closePhotoButton.style.cursor = "pointer";
    closePhotoButton.style.zIndex = "1001";

    closePhotoButton.addEventListener("click", () => {
        photoOverlay.style.display = "none";
    });

    photoContainer.appendChild(img);
    photoOverlay.appendChild(photoContainer);
    photoOverlay.appendChild(closePhotoButton);
    document.body.appendChild(photoOverlay);

    // Cria a div para exibir o projeto no container
    const projectOverlay = document.createElement("div");
    projectOverlay.className = "project-overlay";
    projectOverlay.style.position = "fixed";
    projectOverlay.style.top = "0";
    projectOverlay.style.left = "0";
    projectOverlay.style.width = "100%";
    projectOverlay.style.height = "100%";
    projectOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    projectOverlay.style.display = "none";
    projectOverlay.style.justifyContent = "center";
    projectOverlay.style.alignItems = "center";
    projectOverlay.style.zIndex = "1000";

    const projectContainer = document.createElement("div");
    projectContainer.className = "project-container";

    const projectImg = document.createElement("img");
    projectImg.style.maxWidth = "90vw";
    projectImg.style.maxHeight = "90vh";
    projectImg.className = "zoomable";

    const closeProjectButton = document.createElement("button");
    closeProjectButton.innerHTML = "Fechar";
    closeProjectButton.className = "close-button";
    closeProjectButton.style.position = "absolute";
    closeProjectButton.style.top = "10px";
    closeProjectButton.style.right = "10px";
    closeProjectButton.style.backgroundColor = "#ff5c5c";
    closeProjectButton.style.border = "none";
    closeProjectButton.style.color = "white";
    closeProjectButton.style.padding = "10px";
    closeProjectButton.style.cursor = "pointer";
    closeProjectButton.style.zIndex = "1001";

    closeProjectButton.addEventListener("click", () => {
        projectOverlay.style.display = "none";
        projectImg.style.transform = "scale(1)";
    });

    projectContainer.appendChild(projectImg);
    projectOverlay.appendChild(projectContainer);
    projectOverlay.appendChild(closeProjectButton);
    document.body.appendChild(projectOverlay);

    // Função para exibir a foto
    function showPhoto(photoUrl) {
        img.src = photoUrl;
        photoOverlay.style.display = "flex";
    }

    // Função para exibir o projeto com zoom usando a roda do mouse
    function showProject(projectUrl) {
        projectImg.src = projectUrl;
        projectOverlay.style.display = "flex";

        // Variáveis para o zoom
        let scale = 1;
        let originX = 0;
        let originY = 0;

        // Adiciona a funcionalidade de zoom com a roda do mouse
        projectImg.onwheel = (event) => {
            event.preventDefault();

            // Calcula a nova escala
            const delta = event.deltaY > 0 ? 0.9 : 1.1;
            scale *= delta;

            // Posição do cursor em relação à imagem
            const rect = projectImg.getBoundingClientRect();
            originX = (event.clientX - rect.left) / rect.width;
            originY = (event.clientY - rect.top) / rect.height;

            // Atualiza a origem do zoom com base na posição do cursor
            projectImg.style.transformOrigin = `${originX * 100}% ${originY * 100}%`;
            projectImg.style.transform = `scale(${scale})`;
        };
    }

    function hideMenu() {
        menu.style.display = "none";
    }

    document.addEventListener("click", hideMenu);

    main.selectAll('g.node')
        .on("contextmenu", function(event, d) {
            event.preventDefault();

            // Limpa o menu
            menu.innerHTML = "";

            // Verifica se "photo" ou "projeto" existem e adiciona os botões ao menu
            if (d.data.photo) {
                const viewPhotoBtn = document.createElement("button");
                viewPhotoBtn.innerHTML = "Ver Foto";
                viewPhotoBtn.addEventListener("click", () => {
                    showPhoto(d.data.photo);
                    hideMenu();
                });
                menu.appendChild(viewPhotoBtn);
            }

            if (d.data.projeto) {
                const viewProjectBtn = document.createElement("button");
                viewProjectBtn.innerHTML = "Ver Projeto";
                viewProjectBtn.addEventListener("click", () => {
                    showProject(d.data.projeto);
                    hideMenu();
                });
                menu.appendChild(viewProjectBtn);
            }

            // Se nenhum estiver presente, exibe "Vazio"
            if (!d.data.photo && !d.data.projeto) {
                const emptySpan = document.createElement("span");
                emptySpan.innerHTML = "Vazio";
                menu.appendChild(emptySpan);
            }

            // Posiciona o menu no local do clique
            menu.style.left = `${event.pageX}px`;
            menu.style.top = `${event.pageY}px`;
            menu.style.display = "block";
        });
}
