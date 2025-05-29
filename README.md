# 📋 API - Gerenciador de Tarefas

## ✨ Descrição

Esta API tem como objetivo fornecer funcionalidades completas para o gerenciamento de tarefas dentro de equipes. Usuários podem criar contas, autenticar-se, criar times e gerenciar tarefas com diferentes níveis de prioridade e status. Tarefas podem ser atribuídas a membros específicos das equipes, e todo o fluxo é controlado com autenticação via JWT e níveis de acesso.

---

## 🚀 Tecnologias e Recursos

### Backend
- **Node.js**
  - Framework: **Express.js**
  - Linguagem: **TypeScript**
  - ORM: **Prisma**
  - Validação: **Zod**
  - Autenticação: **JWT**

### Banco de Dados
- **PostgreSQL**

### Testes
- **Jest**

### Deploy
- **Render**

### Outros
- **Docker**

---

## 🧩 Funcionalidades da Aplicação

### 🔐 Autenticação e Autorização
- Cadastro e login de usuários
- Geração de token JWT para sessões
- Níveis de acesso:
  - `admin`: gerenciamento de usuários e equipes
  - `member`: gerenciamento de suas próprias tarefas

---

### 👥 Gerenciamento de Times
- Apenas administradores podem:
  - Criar e editar times
  - Adicionar e remover membros dos times

---

### ✅ Gerenciamento de Tarefas
- CRUD de tarefas
- Atributos:
  - **Status:** `Pendente`, `Em progresso`, `Concluído`
  - **Prioridade:** `Alta`, `Média`, `Baixa`
- Atribuição de tarefas para membros específicos
- Visibilidade e permissões:
  - `admin`: gerencia todas as tarefas
  - `member`: vê tarefas da equipe, mas edita apenas as suas

---

## 🗄️ Estrutura do Banco de Dados

### 1. `users`
Armazena os dados dos usuários.

| Campo        | Tipo                        | Descrição                     |
|--------------|-----------------------------|-------------------------------|
| id           | INTEGER                     | Identificador único (PK)      |
| name         | VARCHAR(100)                | Nome do usuário               |
| email        | VARCHAR(150)                | E-mail do usuário (único)     |
| password     | VARCHAR(255)                | Senha (hash)                  |
| role         | ENUM('admin', 'member')     | Nível de acesso               |
| created_at   | TIMESTAMP                   | Data de criação               |
| updated_at   | TIMESTAMP                   | Data de atualização           |

---

### 2. `teams`
Representa os times cadastrados.

| Campo        | Tipo             | Descrição                     |
|--------------|------------------|-------------------------------|
| id           | INTEGER          | Identificador único (PK)      |
| name         | VARCHAR(100)     | Nome do time                  |
| description  | TEXT             | Descrição opcional            |
| created_at   | TIMESTAMP        | Data de criação               |
| updated_at   | TIMESTAMP        | Data de atualização           |

---

### 3. `team_members`
Relaciona usuários com times.

| Campo        | Tipo     | Descrição                             |
|--------------|----------|----------------------------------------|
| id           | INTEGER  | Identificador único (PK)              |
| user_id      | INTEGER  | FK para `users.id`                    |
| team_id      | INTEGER  | FK para `teams.id`                    |
| created_at   | TIMESTAMP| Data de criação                       |

---

### 4. `tasks`
Armazena as tarefas atribuídas.

| Campo        | Tipo                                 | Descrição                             |
|--------------|--------------------------------------|----------------------------------------|
| id           | INTEGER                              | Identificador único (PK)              |
| title        | VARCHAR(200)                         | Título da tarefa                      |
| description  | TEXT                                 | Descrição detalhada                   |
| status       | ENUM('pending', 'in_progress', 'completed') | Status da tarefa             |
| priority     | ENUM('high', 'medium', 'low')        | Prioridade da tarefa                  |
| assigned_to  | INTEGER                              | FK para `users.id`                    |
| team_id      | INTEGER                              | FK para `teams.id`                    |
| created_at   | TIMESTAMP                            | Data de criação                       |
| updated_at   | TIMESTAMP                            | Data de atualização                   |

---

## 🔗 Relacionamentos Resumidos

- `users` → `teams` via `team_members`
- `users` → `tasks` via `assigned_to`
- `teams` → `tasks` via `team_id`

---

## 🐳 Docker

Este projeto está preparado para rodar com Docker. Basta executar os seguintes comandos:

```bash
docker-compose up --build
```

---

## 🧪 Testes

Para rodar os testes, utilize:

```bash
npm run test:dev
```

---
