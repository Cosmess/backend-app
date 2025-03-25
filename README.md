# Backend para Gestão de Profissionais e Consultórios

## 📌 Sobre o Projeto
Este projeto é uma API REST desenvolvida com **NestJS** para gerenciamento de profissionais e consultórios odontológicos. A API segue a arquitetura **DDD (Domain-Driven Design)** e utiliza **Firebase Firestore** como banco de dados.

## 🚀 Tecnologias Utilizadas
- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Firebase Firestore** - Banco de dados NoSQL
- **Axios** - Consumo de APIs externas
- **Swagger** - Documentação interativa
- **Docker** - Contêinerização do ambiente

## 📂 Estrutura do Projeto
```
/nestjs-dentista-api
│── /src
│   │── /application
│   │   │── /services
│   │   │   │── profissional.service.ts
│   │   │   │── estabelecimento.service.ts
│   │── /domain
│   │   │── /entities
│   │   │   │── profissional.entity.ts
│   │   │   │── estabelecimento.entity.ts
│   │   │── /repositories
│   │   │   │── profissional.repository.ts
│   │   │   │── estabelecimento.repository.ts
│   │── /infrastructure
│   │   │── /firebase
│   │   │   │── firebase.module.ts
│   │   │   │── firebase.service.ts
│   │   │── /external
│   │   │   │── cro-api.service.ts
│   │── /presentation
│   │   │── /dtos
│   │   │   │── profissional.dto.ts
│   │   │   │── estabelecimento.dto.ts
│   │   │── /controllers
│   │   │   │── profissional.controller.ts
│   │   │   │── estabelecimento.controller.ts
│   │   │   │── tools.controller.ts
│   │── app.module.ts
│   │── main.ts
│── .env
│── package.json
│── tsconfig.json
│── README.md
```

## ⚙️ Configuração do `.env`
Para rodar o projeto, crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```
PORT=3000
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_PRIVATE_KEY="sua_chave_privada"
FIREBASE_CLIENT_EMAIL=seu_email_firebase
FIREBASE_DATABASE_URL=https://seu-database.firebaseio.com
CRO_API =https://cro-sp.implanta.net.br/servicosonline//publico/ConsultaInscritos/Buscar
```

## 🛠️ Como Rodar o Projeto
1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-repo/nestjs-dentista-api.git
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Rode o projeto:**
   ```sh
   npm run start:dev
   ```
4. **Acesse a documentação Swagger:**
   ```sh
   http://localhost:3000/api
   ```

## 📌 Endpoints Principais
- **Profissionais** (`/profissionais`)
- **Consultórios** (`/estabelecimentos`)
- **Consulta CRO** (`/tools/cro/:numeroRegistro`)
