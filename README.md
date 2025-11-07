# CapiFit - Hub do Treinador

CapiFit é uma aplicação web completa para personal trainers gerenciarem clientes, criarem planos de treino e dieta, acompanharem o progresso e se comunicarem de forma eficaz. Inclui assistência com tecnologia de IA para a geração de planos.

Esta aplicação é construída com uma arquitetura Cliente-Servidor:
- **Frontend:** React (Vite) responsável pela interface do usuário.
- **Backend:** Node.js (Express) que serve uma API RESTful e se comunica com o banco de dados.

---

## Guia de Implantação em VPS Ubuntu 24.04.3

Este guia detalha o processo para implantar a aplicação CapiFit no seu próprio servidor usando Nginx, PM2 e PostgreSQL.

**Domínio de Exemplo:** `capifit.app.br`

### 1. Pré-requisitos do Servidor

Conecte-se ao seu servidor via SSH e atualize os pacotes do sistema.

```bash
sudo apt update && sudo apt upgrade -y
```

Instale as dependências necessárias: Node.js (versão 20.x ou superior), npm, Git, PostgreSQL e Nginx.

```bash
# Instalar Node.js e npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Git
sudo apt install git -y

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar Nginx
sudo apt install nginx -y

# Verificar instalações
node -v
npm -v
git --version
psql --version
nginx -v
```

### 2. Configuração do Banco de Dados (PostgreSQL)

1.  Inicie sessão no PostgreSQL para criar o usuário e o banco de dados.

    ```bash
    sudo -u postgres psql
    ```

2.  Dentro do prompt do `psql`, execute os seguintes comandos. Substitua `seu_usuario` e `sua_senha_segura` por credenciais de sua escolha.

    ```sql
    -- Criar um novo usuário (role) com uma senha segura
    CREATE ROLE seu_usuario WITH LOGIN PASSWORD 'sua_senha_segura';

    -- Dar permissão para o usuário criar bancos de dados
    ALTER ROLE seu_usuario CREATEDB;

    -- Sair do superusuário postgres
    \q
    ```

3.  Faça login como o novo usuário para criar o banco de dados.

    ```bash
    psql -U seu_usuario -d postgres
    ```

4.  Crie o banco de dados `capifit_db`.

    ```sql
    CREATE DATABASE capifit_db;

    -- Conecte-se ao novo banco de dados para criar as tabelas
    \c capifit_db

    -- TODO: Adicione aqui seus comandos CREATE TABLE para 'students', 'workout_plans', 'diet_plans', etc.
    -- Exemplo inicial:
    CREATE TABLE students (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatarUrl TEXT,
        plan VARCHAR(100),
        status VARCHAR(50),
        lastActive VARCHAR(100),
        workoutPlanId VARCHAR(255),
        dietPlanId VARCHAR(255)
    );

    -- Sair do psql
    \q
    ```

### 3. Clonar e Configurar a Aplicação

1.  Clone o repositório do projeto para um diretório de sua escolha (ex: `/var/www/`).

    ```bash
    sudo mkdir -p /var/www
    sudo chown $USER:$USER /var/www
    cd /var/www
    git clone <URL_DO_SEU_REPOSITORIO_GIT> capifit
    cd capifit
    ```

2.  **Configurar o Backend:**

    Navegue até o diretório do backend e instale as dependências.

    ```bash
    cd backend
    npm install
    ```

    Crie o arquivo de variáveis de ambiente `.env` a partir do exemplo.

    ```bash
    cp .env.example .env
    ```

    Edite o arquivo `.env` com suas configurações.

    ```bash
    nano .env
    ```

    Preencha com suas credenciais do banco de dados e a chave da API Gemini.

    ```ini
    # Porta para o servidor backend rodar
    PORT=5000

    # String de conexão do PostgreSQL
    DATABASE_URL="postgresql://seu_usuario:sua_senha_segura@localhost:5432/capifit_db"

    # Sua chave da API do Google Gemini
    API_KEY="SUA_CHAVE_API_AQUI"
    ```

### 4. Executar em Produção com PM2

PM2 é um gerenciador de processos que manterá sua aplicação online.

1.  Instale o PM2 globalmente.

    ```bash
    sudo npm install pm2 -g
    ```

2.  Inicie o servidor backend com PM2.

    ```bash
    # Estando no diretório raiz do projeto (/var/www/capifit)
    pm2 start backend/server.js --name capifit-api
    ```

3.  Configure o PM2 para iniciar automaticamente na reinicialização do servidor.

    ```bash
    pm2 startup
    # Siga as instruções que o comando acima fornecer
    pm2 save
    ```

### 5. Configurar o Nginx como Proxy Reverso

O Nginx servirá os arquivos estáticos do frontend e redirecionará as chamadas de API para o backend Node.js.

1.  Crie um novo arquivo de configuração do Nginx para o seu domínio.

    ```bash
    sudo nano /etc/nginx/sites-available/capifit.app.br
    ```

2.  Cole a seguinte configuração no arquivo. Certifique-se de que `root` aponta para o diretório raiz do seu projeto.

    ```nginx
    server {
        listen 80;
        server_name capifit.app.br www.capifit.app.br;

        # Localização dos arquivos do frontend
        root /var/www/capifit;
        index index.html;

        location / {
            # Tenta encontrar o arquivo solicitado, senão retorna o index.html (para o React Router funcionar)
            try_files $uri $uri/ /index.html;
        }

        # Redireciona todas as requisições /api para o backend
        location /api/ {
            proxy_pass http://localhost:5000; # A porta deve ser a mesma do seu .env
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  Ative a configuração criando um link simbólico.

    ```bash
    sudo ln -s /etc/nginx/sites-available/capifit.app.br /etc/nginx/sites-enabled/
    ```

4.  Remova o link de configuração padrão se ele existir.

    ```bash
    sudo rm /etc/nginx/sites-enabled/default
    ```

5.  Teste a configuração do Nginx e reinicie o serviço.

    ```bash
    sudo nginx -t
    # Se mostrar "syntax is ok" e "test is successful", prossiga.
    sudo systemctl restart nginx
    ```

### 6. (Recomendado) Proteger com SSL (HTTPS)

Use o Certbot para obter um certificado SSL gratuito da Let's Encrypt.

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d capifit.app.br -d www.capifit.app.br
```

Siga as instruções na tela. O Certbot irá configurar automaticamente o SSL e renovar o certificado quando necessário.

**Pronto!** Sua aplicação CapiFit deve estar acessível em `https://capifit.app.br`.
