# Projeto E-commerce IoC

Professor, este repositório contém a implementação do projeto de e-commerce focado nos conceitos de **Inversão de Controle (IoC)** e **Injeção de Dependências**.

Abaixo deixei o passo a passo para rodar o projeto e algumas explicações sobre como atendi aos critérios solicitados.

---

## Como rodar o projeto

Você pode rodar a aplicação do zero seguindo estes passos no terminal:

1. **Clonar e instalar as dependências:**
   ```bash
   git clone <LINK_DO_REPOSITORIO>
   cd ecommerce-ioc
   npm install
   ```

2. **Configurar o ambiente (`.env`):**
   Crie um arquivo `.env` na raiz (pode basear no `.env.example`) definindo qual modo quer testar:
   ```env
   APP_ENV=dev
   ```

3. **Rodar as migrações e o seed do banco:**
   Para rodar as migrações do Prisma e já popular os produtos no banco:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Subir a aplicação:**
   ```bash
   npm run dev
   ```

---

## Sobre os 2 modos de execução (`APP_ENV`)

Para alternar entre os ambientes, **basta alterar o valor da variável `APP_ENV` no `.env`**:

- **`APP_ENV=dev`**: O container carrega os repositórios em memória (`InMemoryOrderRepository`) e o provider de log (`ConsoleMailProvider`).
- **`APP_ENV=prod`**: O container injeta o repositório conectado ao Prisma (`PrismaOrderRepository`, `PrismaProductRepository`) e o provider do Ethereal Mail.

---

## Como os critérios foram aplicados

Como pedido no enunciado:

- **Centralização da escolha:** Toda a tomada de decisão sobre qual implementação usar fica restrita ao arquivo `src/container/container.ts`.
- **Desacoplamento total:** Nenhum serviço ou controller lê `APP_ENV` ou importa Prisma, Nodemailer ou repositórios concretos. Eles dependem apenas das interfaces.
- **`app.ts` enxuto:** O arquivo `app.ts` apenas solicita a instância do `OrderController` ao container e registra as rotas.
- **Cálculo dos produtos 1 e 2:** Ao fazer a requisição `POST /orders` informando os produtos `1` e `2`, o total é calculado corretamente tanto no modo `dev` quanto no modo `prod`.

---

### Exemplo de Payload para teste (`POST /orders`)

```json
{
  "products": [
    { "id": "1", "quantity": 1 },
    { "id": "2", "quantity": 1 }
  ],
  "paymentMethod": "PIX"
}
```