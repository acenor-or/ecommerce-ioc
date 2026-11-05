# E-commerce SOLID com InversifyJS (Projeto 2)

API de pedidos de um e-commerce (livro físico e e-book) que já aplicava SRP, OCP e LSP. Neste projeto, a montagem das dependências, que antes era feita à mão com `new` no `app.ts`, passou para um container de IoC, o **InversifyJS**. Com isso, dá para trocar a infraestrutura (e-mail e banco de pedidos) mudando uma única variável de ambiente, sem tocar nas regras de negócio.

## Como rodar

### 1. Instalação (igual nos dois modos)

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
```

Crie o arquivo `.env` a partir do exemplo:

```bash
# Linux / macOS / Git Bash
cp .env.example .env

# Windows (cmd)
copy .env.example .env
```

### 2. Escolha o modo no `.env`

O modo é definido pela variável `APP_ENV`. Depois de alterar o `.env`, pare e inicie o servidor de novo (`Ctrl + C` e `npm run dev`).

| | `APP_ENV=dev` | `APP_ENV=test` |
|---|---|---|
| E-mail | `EtherealMailProvider` (envia para o Ethereal, precisa de internet) | `ConsoleMailProvider` (imprime o e-mail no console) |
| Pedidos | `PrismaOrderRepository` (grava no SQLite) | `InMemoryOrderRepository` (guarda num array, some ao parar o servidor) |
| Internet | necessária (Ethereal) | **não é necessária** |

Se `APP_ENV` não existir, vale `dev`. Qualquer valor diferente de `dev` e `test` faz a aplicação parar com uma mensagem de erro.

### 3. Execução

```bash
npm run dev
```

A API sobe em `http://localhost:3000`.

### 4. Testando

Livro físico (`productId: 1`), total esperado **R$ 110** (R$ 100 + R$ 10 de frete):

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

E-book (`productId: 2`), total esperado **R$ 50** (sem frete):

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "pix",
  "paymentDetails": {}
}'
```

Formas de pagamento aceitas: `credit_card`, `debit_card` e `pix`.

- No modo `dev`, a resposta traz o `emailPreview` (link do e-mail no Ethereal).
- No modo `test`, o `emailPreview` vem `null` e o e-mail aparece no console do servidor.

## Como o container funciona

```
src/
├── container/
│   ├── types.ts        # um Symbol para cada dependência (TYPES.MailProvider, ...)
│   └── container.ts    # único arquivo que importa classes concretas, lê o APP_ENV e faz os bind
├── controllers/        # OrderController: só HTTP
├── services/           # OrderService e NotificationService (só conhecem interfaces)
├── domain/             # produtos, pedido e erros de negócio
├── repositories/       # IOrderRepository, IProductRepository + Prisma e InMemory
├── providers/          # IMailProvider + Ethereal e Console
├── payments/           # IPaymentMethod, uma classe por forma de pagamento e o registro
└── app.ts              # pede o OrderController ao container e registra a rota
```

- Toda classe gerenciada pelo container tem `@injectable()`, e todo parâmetro de construtor tem `@inject(TYPES.X)`.
- As três formas de pagamento são registradas com o mesmo identificador (`TYPES.PaymentMethod`) e chegam ao `PaymentMethodRegistry` por `@multiInject`.
- Provider de e-mail e repositórios são singleton (`inSingletonScope()`).
- Nenhum arquivo de `services/` ou `controllers/` lê o `APP_ENV` nem importa Prisma, Nodemailer ou uma implementação concreta de repositório, provider ou pagamento.
