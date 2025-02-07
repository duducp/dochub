const urlParams = new URLSearchParams(window.location.search);

document.addEventListener('DOMContentLoaded', function() {
    fetch('settings.json')
        .then(response => response.json())
        .then(
            data => {
                document.getElementById("headerGithubLink").href = data.officialRepository;

                data.items.forEach(item => {
                    loadDropdown(item);
                    loadPageContent(item);
                });
            }
        )
        .catch(error => {
            console.error('Erro ao carregar arquivos:', error);
        });
});

function loadDropdown(item) {
    // Configurações do dropdown
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const optionElement = document.createElement('li');
    const linkElement = document.createElement('a');

    linkElement.classList.add('dropdown-item');

    // Adicionar link interno ao item do dropdown
    linkElement.href = `content.html?id=${item.id}`;
    linkElement.textContent = item.selectOptionTitle;

    // Adicionar link externo e ícone de link externo ao item do dropdown
    if (item.type === 'link') {
        const externalIcon = document.createElement('i');
        externalIcon.classList.add('bi', 'bi-box-arrow-up-right');

        linkElement.href = item.reference;
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";
        linkElement.appendChild(document.createTextNode(' '));
        linkElement.appendChild(externalIcon);
    }

    // Adicionar classe 'active' ao item selecionado
    if (urlParams && urlParams.get("id") === item.id) {
        linkElement.classList.add('active');
    }

    // Adicionar item ao dropdown
    optionElement.appendChild(linkElement);
    dropdownMenu.appendChild(optionElement);

    // Filtrar itens do dropdown
    document.getElementById('filterInput').addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const items = document.querySelectorAll('.dropdown-item');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
                item.style.display = ''; // Mostra o item
            } else {
                item.style.display = 'none'; // Oculta o item
            }
        });
    });
}

function loadPageContent(item) {
    const id = urlParams.get("id");

    if (urlParams.get("readme") == 1) {
        runMarkdown('README.md');
    }

    if (item.id === id) {
        if (item.docTitle) {
            document.getElementById("title").innerText = item.docTitle;
        }

        if (item.repository) {
            document.getElementById("headerGithubLink").href = item.repository;
        }

        if (item.type === "openapi-redoc") {
            runRedoc(item.reference);
        } else if (item.type === "openapi-swagger") {
            runSwagger(item.reference);
        } else if (item.type === "iframe") {
            runIframe(item.reference, item.docTitle);
        } else if (item.type === "markdown") {
            runMarkdown(item.reference);
        } else if (item.type === "link") {
            addBottonToRedirect(item.reference);
        }
    }
}

function runRedoc(reference) {
    Redoc.init(
        reference,
        {
            theme: {
                colors: {
                primary: {
                    main: "#ff5722",
                },
                },
            },
        },
        document.getElementById("content")
    );
}

function runSwagger(reference) {
    SwaggerUIBundle({
        url: reference,
        dom_id: '#content',
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset,
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl,
        ],
        layout: "BaseLayout", // BaseLayout
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
    });
}

function runIframe(reference, title) {
    const iframe = document.createElement("iframe");
    iframe.src = reference;
    iframe.title = title;
    iframe.classList.add("iframe", "w-100", "border-0");
    document.getElementById("content").appendChild(iframe);
}

function runMarkdown(reference) {
    fetch(reference)
        .then(response => response.text())
        .then(text => {
            // Converter markdown para HTML
            const converter = new showdown.Converter();
            const html = converter.makeHtml(text);

            // Adicionar HTML ao card
            document.getElementById("cardBody").innerHTML = html;
            document.getElementById("cardMarkdown").classList.remove('d-none');

            // Adicionar syntax highlighter
            hljs.highlightAll();

            // Adicionar botões de copiar
            const codeBlocks = document.querySelectorAll('pre');
            codeBlocks.forEach((block) => {
                const button = document.createElement('button');
                button.textContent = 'Copiar';
                button.classList.add("button-copy");
                button.id = "buttonCopy";
                block.appendChild(button);

                button.addEventListener('click', () => {
                    const code = block.querySelector('code').innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        console.log('Código copiado!');
                    }).catch(err => {
                        console.error('Erro ao copiar: ', err);
                    });
                });
            });
        })
        .catch(err => console.error(err));
}

function addBottonToRedirect(link) {
    document.getElementById('cardExternalLink').classList.remove('d-none');
    document.getElementById("bottonExternalLink").href = link;
}
