const urlParams = new URLSearchParams(window.location.search);

document.addEventListener('DOMContentLoaded', function() {
    fetch('settings.json')
        .then(response => response.json())
        .then(
            data => {
                document.getElementById("headerGithubLink").href = data.officialRepository;
                document.getElementById("title").innerText = data.title;

                data.items.forEach(item => {
                    dropdown(item);
                    pageContent(item);
                });
            }
        )
        .catch(error => {
            console.error('Erro ao carregar arquivos:', error);
        });
});

function dropdown(item) {
    const dropdownMenu = document.querySelector('.dropdown-menu');

    const optionElement = document.createElement('li');
    const linkElement = document.createElement('a');

    linkElement.classList.add('dropdown-item');
    linkElement.href = `content.html?id=${item.id}`;
    linkElement.textContent = item.selectOptionTitle;

    if (urlParams && urlParams.get("id") === item.id) {
        linkElement.classList.add('active');
    }

    if (item.type === 'link') {
        const externalIcon = document.createElement('i');
        externalIcon.classList.add('bi', 'bi-box-arrow-up-right');

        linkElement.href = item.reference;
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";
        linkElement.appendChild(document.createTextNode(' '));
        linkElement.appendChild(externalIcon);
    }

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

function pageContent(item) {
    const id = urlParams.get("id");

    if (urlParams.get("readme") == 1) {
        runMarkdown('README.md');
    }

    if (item.id === id) {
        document.getElementById("title").innerText = item.docTitle;

        if (item.repository) {
            document.getElementById("headerGithubLink").href = item.repository;
        }

        if (item.type === "openapi") {
            runRedoc(item.reference);
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

            // Colorir o código
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
