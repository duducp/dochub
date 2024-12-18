
## Endpoints

### 1. Listar todos os itens

- **Método**: `GET`
- **Endpoint**: `/items`
- **Descrição**: Retorna uma lista de todos os itens.
- **Resposta**:
    - **Código 200**: Lista de itens.
    - **Exemplo de Resposta**:

        ```json
        [
            {
                "id": "1",
                "name": "Item Exemplo 1",
                "description": "Descrição do item exemplo 1",
                "price": 19.99
            },
            {
                "id": "2",
                "name": "Item Exemplo 2",
                "description": "Descrição do item exemplo 2",
                "price": 29.99
            }
        ]
        ```

### 2. Criar um novo item

- **Método**: `POST`
- **Endpoint**: `/items`
- **Descrição**: Cria um novo item.
- **Requisição**:
    - **Corpo**:

        ```json
        {
            "name": "Novo Item",
            "description": "Descrição do novo item",
            "price": 15.99
        }
        ```
- **Resposta**:
    - **Código 201**: Item criado com sucesso.
    - **Exemplo de Resposta**:

        ```json
        {
            "id": "3",
            "name": "Novo Item",
            "description": "Descrição do novo item",
            "price": 15.99
        }
    ```

### 3. Obter um item específico

- **Método**: `GET`
- **Endpoint**: `/items/{id}`
- **Descrição**: Retorna um item específico pelo ID.
- **Parâmetros**:
    - `id` (string): ID do item a ser retornado.
- **Resposta**:
    - **Código 200**: Item encontrado.
    - **Código 404**: Item não encontrado.
    - **Exemplo de Resposta**:

        ```json
        {
            "id": "1",
            "name": "Item Exemplo 1",
            "description": "Descrição do item exemplo 1",
            "price": 19.99
        }
        ```

### 4. Atualizar um item existente

- **Método**: `PUT`
- **Endpoint**: `/items/{id}`
- **Descrição**: Atualiza um item existente.
- **Parâmetros**:
    - `id` (string): ID do item a ser atualizado.
- **Requisição**:
     - **Corpo**:

        ```json
        {
            "name": "Item Atualizado",
            "description": "Descrição do item atualizado",
            "price": 25.99
        }
    ```
- **Resposta**:
    - **Código 200**: Item atualizado com sucesso.
    - **Código 404**: Item não encontrado.
    - **Exemplo de Resposta**:

        ```json
        {
            "id": "1",
            "name": "Item Atualizado",
            "description": "Descrição do item atualizado",
            "price": 25.99
        }
        ```

### 5. Deletar um item

- **Método**: `DELETE`
- **Endpoint**: `/items/{id}`
- **Descrição**: Deleta um item pelo ID.
- **Parâmetros**:
    - `id` (string): ID do item a ser deletado.
- **Resposta**:
    - **Código 204**: Item deletado com sucesso.
    - **Código 404**: Item não encontrado.

## Exemplos de Uso

### Listar Itens

```bash
curl -X GET http://localhost:3000/api/items
```
