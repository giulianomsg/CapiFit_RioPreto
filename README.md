# CapiFit - Plataforma Completa para Personal Trainers e Alunos

CapiFit é uma plataforma web e mobile completa, projetada para que personal trainers e nutricionistas gerenciem seus alunos, treinos, dietas, avaliações físicas e assinaturas, enquanto os alunos acompanham seu progresso e se comunicam com seus profissionais.

---

## Arquitetura da Aplicação

- **Backend:** Node.js (Express) servindo uma API RESTful segura.
- **Frontend Web:** React (a ser reconstruído para consumir a nova API).
- **Banco de Dados:** MySQL.
- **Autenticação:** Tokens JWT (JSON Web Tokens) e criptografia de senhas com bcrypt.

---

## Guia de Implantação e Desenvolvimento Local

Este guia foca na configuração do ambiente de desenvolvimento para o backend e o banco de dados, que são a fundação do sistema.

### 1. Pré-requisitos

- **Node.js:** Versão 20.x ou superior.
- **NPM:** (Vem com o Node.js).
- **Git:** Para clonar o repositório.
- **MySQL:** Um servidor de banco de dados MySQL (pode ser local, via Docker, ou em um serviço de nuvem).

### 2. Configuração do Banco de Dados (MySQL)

1.  **Crie o Banco de Dados:**
    Acesse seu servidor MySQL e crie um novo banco de dados para o projeto.

    ```sql
    CREATE DATABASE capifit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

2.  **Crie as Tabelas:**
    Use o arquivo `database.sql` fornecido na raiz do projeto para criar todas as tabelas e a estrutura inicial. Você pode importar o arquivo usando uma ferramenta como DBeaver, HeidiSQL, ou pela linha de comando:

    ```bash
    mysql -u SEU_USUARIO -p capifit_db < database.sql
    ```

### 3. Configuração do Backend

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GIT> capifit
    cd capifit/backend
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` dentro da pasta `backend` a partir do exemplo fornecido.

    ```bash
    cp .env.example .env
    ```

    Agora, edite o arquivo `.env` e preencha com suas credenciais do banco de dados e segredos da aplicação.

    ```ini
    # Configurações do Servidor
    PORT=5000

    # Credenciais do Banco de Dados MySQL
    DB_HOST="localhost"
    DB_USER="seu_usuario_mysql"
    DB_PASSWORD="sua_senha_mysql"
    DB_NAME="capifit_db"

    # Segredos para Autenticação
    JWT_SECRET="gere_uma_string_aleatoria_e_segura_aqui"

    # Chave da API do Google Gemini (opcional, para funcionalidades de IA)
    API_KEY="SUA_CHAVE_API_GEMINI_AQUI"
    ```

### 4. Executando o Backend

Com o banco de dados e o `.env` configurados, você pode iniciar o servidor backend.

```bash
# Dentro da pasta /backend
npm start
```

O servidor estará rodando em `http://localhost:5000`. Agora você pode usar uma ferramenta como Postman ou Insomnia para testar os endpoints da API (ex: `POST /api/auth/register`).

### 5. Desenvolvimento do Frontend

O frontend (localizado na pasta raiz) pode ser iniciado com os comandos padrão do React/Vite, mas lembre-se que ele precisará ser reconstruído para se comunicar com a nova estrutura da API.

```bash
# Na pasta raiz do projeto
npm install
# (depois de instalar, o comando para rodar pode variar, mas geralmente é `npm run dev` ou similar)
```