<p align="center">
    <img src="public/images/logo.png" alt="DocHub" height="70"/>
</p>

DocHub é iniciativa que visa consolidar toda a documentação das APIs dos serviços da nossa empresa em um único repositório acessível e intuitivo. O objetivo é facilitar o acesso à informação, garantir que a documentação esteja sempre atualizada e promover a colaboração entre os usuários.

Com o DocHub, buscamos aprimorar a integração entre os serviços, aumentar a eficiência das equipes e fomentar um ambiente de aprendizado contínuo, tornando a comunicação e o desenvolvimento mais ágeis e eficazes.

## Adicionar documentação

Para adicionar uma nova documentação ao projeto, você deve editar o arquivo de `settings`. A inclusão é feita adicionando um objeto à lista de `items`. Veja um exemplo abaixo:

```json
{
    "id": "1",
    "type": "openapi",
    "reference": "docs/my-api.openapi.json",
    "repository": "https://duducp.github.io/dochub",
    "docTitle": "Documentação OpenAPi Json",
    "selectOptionTitle": "OpenApi Json"
}
```

### Descrição dos Parâmetros

- **id**: Identificador único da documentação. Pode ser qualquer valor, desde que não haja duplicatas no arquivo de settings.
- **type**: Tipo de documentação que está sendo adicionada:
    - link: A documentação está disponível em um site externo.
    - iframe: A documentação externa será carregada diretamente na página do projeto.
    - openapi: A documentação será renderizada a partir de um arquivo no formato json, seguindo o padrão OpenAPI.
    - markdown: A documentação será renderizada a partir de um arquivo no formato markdown.
- **reference**: Link externo da documentação ou caminho do arquivo que será renderizado dentro do projeto.
- **repository**: Link para acessar o repositório do projeto relacionado à documentação.
- **docTitle**: Título que será exibido quando a documentação for renderizada no projeto.
- **selectOptionTitle**: Título que aparecerá no seletor de documentação na página inicial do projeto.

### Atualização automática da documentação

A idéia é que a documentação seja atualizada automaticamente a partir de um repositório de origem.
Para isso, é necessário criar um arquivo de documentação no formato OpenAPI ou Markdown e disponibilizá-lo em um repositório.
A partir disso, é possível criar um fluxo de trabalho no GitHub Actions para sincronizar o arquivo de documentação com o repositório do projeto.

Exemplo de fluxo de trabalho para sincronização de arquivo de documentação:

```yaml
name: Sync Doc and Manage Pull Request

on:
  push:
    branches:
      - main

permissions:
  contents: write  # Permissão para ler e escrever no conteúdo do repositório
  pull-requests: write  # Permissão para gerenciar pull requests

env:
  REPO_URL: https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/MY_USER/MY_REPO.git

jobs:
  sync-file:
    runs-on: ubuntu-latest

    steps:
      # Checkout do repositório atual
      - name: Checkout Current Repository
        uses: actions/checkout@v3

      # Extrair o nome do repositório atual
      - name: Extract Current Repository Name
        id: repo_name
        run: echo "REPO_NAME=${GITHUB_REPOSITORY##*/}" >> $GITHUB_ENV

      # Definir o nome do novo arquivo
      - name: Set New File Name
        run: echo "NEW_FILE_NAME=${{ env.REPO_NAME }}-openapi.json" >> $GITHUB_ENV

      # aqui pode ser feito o passo para gerar o arquivo de documentação

      # Copiar o arquivo desejado e renomear
      - name: Copy and Rename Doc File
        run: |
          mkdir -p temp-dir
          cp docs/openapi.json temp-dir/
          mv temp-dir/openapi.json temp-dir/${{ env.NEW_FILE_NAME }}

      # Configurar repositório de destino
      - name: Configure Target Repository
        run: |
          git config --global user.name "GitHub Actions Bot"
          git config --global user.email "actions@github.com"
          git clone --depth 1 --branch main $REPO_URL target-repo

      # Sincronizar arquivo com a branch de destino
      - name: Sync File to Branch
        run: |
          cd target-repo
          git checkout -B "${REPO_NAME}"
          cp ../temp-dir/${{ env.NEW_FILE_NAME }} ./
          git add ${{ env.NEW_FILE_NAME }}
          git commit -m "Sync doc file from ${{ env.REPO_NAME }} repository" || echo "No changes to commit"
          git push $REPO_URL "${REPO_NAME}" --force

      # Verificar se há PR aberto para a branch
      - name: Check Existing Pull Request
        id: check_pr
        uses: octokit/request-action@v2.x
        with:
          route: GET /repos/MY_USER/MY_REPO/pulls
          query: |
            {
              "head": "MY_USER:${{ env.REPO_NAME }}",
              "state": "open"
            }
          token: ${{ secrets.GITHUB_TOKEN }}

      # Criar PR se não existir
      - name: Create Pull Request if None Exists
        if: steps.check_pr.outputs.data == '[]'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "Sync doc file from ${{ env.REPO_NAME }} repository"
          branch: ${{ env.REPO_NAME }}
          title: "Sync doc file from ${{ env.REPO_NAME }} repository"
          body: "This PR updates the doc file from the ${{ env.REPO_NAME }} repository."
          reviewers: ${{ github.actor }}

      # Adicionar reviewer ao PR existente
      - name: Add Reviewer to Existing Pull Request
        if: steps.check_pr.outputs.data != '[]'
        run: |
          pr_number=$(echo '${{ steps.check_pr.outputs.data }}' | jq '.[0].number')
          gh pr edit $pr_number --add-reviewer "${{ github.actor }}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
