# Twitter Clone - Backend (NestJS)

API REST desenvolvida com NestJS, PostgreSQL e TypeORM para o clone do Twitter.

## 🚀 Tecnologias

- **Framework**: NestJS (Node.js)
- **Banco**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT
- **Containerização**: Docker

## 📋 Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD de usuários
- ✅ CRUD de tweets
- ✅ Sistema de likes/dislikes
- ✅ Comentários
- ✅ Retweets
- ✅ Validação de dados
- ✅ CORS habilitado

## 🛠️ Desenvolvimento com Docker

### Iniciar Ambiente
```bash
# Usando orquestração raiz (recomendado)
cd ..
docker-compose --profile dev up --build

# Ou standalone
docker-compose up --build
```

### Comandos Úteis
```bash
# Ver logs
docker-compose logs -f backend

# Acessar container
docker-compose exec backend sh

# Resetar banco
docker-compose down -v && docker-compose up -d postgres
```

### Desenvolvimento Local
```bash
npm install
cp .env.example .env
npm run start:dev
```

## 🚀 Produção com Docker

### Deploy
```bash
# Build otimizado
docker-compose build --no-cache

# Executar
docker-compose up -d

# Verificar health
curl http://localhost:3000/health
```

### Variáveis de Ambiente
```bash
DATABASE_TYPE=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=tweet_user
DATABASE_PASSWORD=tweet_password
DATABASE_NAME=tweet_app
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## 🗄️ Banco de Dados

### PostgreSQL
- **Host**: postgres (container)
- **Porta**: 5432
- **Database**: tweet_app
- **User**: tweet_user

### Migrações
```bash
# Criar migration
npm run migration:create -- NomeDaMigration

# Executar migrations
npm run migration:run

# Reverter
npm run migration:revert
```

## 🌐 API Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/profile` - Perfil

### Tweets
- `GET /tweets` - Listar tweets
- `POST /tweets` - Criar tweet
- `GET /tweets/:id` - Buscar tweet
- `POST /tweets/:id/like` - Curtir
- `POST /tweets/:id/dislike` - Descurtir

### Comentários
- `POST /tweets/:id/comments` - Comentar

## 📁 Estrutura

```
src/
├── auth/              # Autenticação
├── entities/          # Entidades DB
├── modules/           # Módulos
├── controllers/       # Controllers
├── services/          # Lógica de negócio
└── main.ts           # Ponto de entrada
```

## 🔧 Scripts

```bash
npm run start:dev     # Desenvolvimento
npm run build         # Build produção
npm run test          # Testes
npm run lint          # Linting
```

## 📄 Licença

UNLICENSED
