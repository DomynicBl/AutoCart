# AutoCart - Projeto de Carrinho de Compras Inteligente

![Node.js](https://img.shields.io/badge/Backend-Node.js-blue?style=for-the-badge&logo=node.js) ![React Native](https://img.shields.io/badge/Frontend-React%20Native-blueviolet?style=for-the-badge&logo=react) ![ESP32](https://img.shields.io/badge/Hardware-ESP32-orange?style=for-the-badge&logo=espressif)

Repositório oficial do projeto **AutoCart**, um protótipo de carrinho de compras inteligente desenvolvido como trabalho acadêmico, para a disciplina e TI V - Sistemas Computacionais. O objetivo é criar uma solução de hardware e software de baixo custo para otimizar a experiência de compra no varejo, focando na transparência de gastos em tempo real e na agilização do processo de checkout.

## 📖 Sobre o Projeto
O setor de varejo enfrenta desafios constantes para melhorar a jornada do cliente. Longas filas no caixa, a frustração com tecnologias de autoatendimento pouco eficazes e a falta de controle sobre o valor total da compra são dores comuns.

O **AutoCart** surge como uma proposta pragmática e acessível para enfrentar esses problemas. Através da integração de um backend robusto, um aplicativo mobile intuitivo e hardware embarcado no próprio carrinho, o projeto visa oferecer uma experiência de compra mais fluida, transparente e moderna.

## 📑 Tabela de Conteúdos
- [Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Chave](#-funcionalidades-chave)
- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Começando (Configurando o Backend)](#-começando-configurando-o-backend)
- [🧑‍💻 Autores](#-autores)

## ✨ Funcionalidades Chave
### Para Clientes (via App Mobile)
- **Autenticação Segura**: Cadastro e login de usuários.
- **Sessão de Compra Personalizada**: Início da compra associando o cliente a um carrinho específico via QR Code.
- **Carrinho Virtual em Tempo Real**: Adição e remoção de produtos com atualização instantânea da lista e do valor total.
- **Finalização Simplificada**: Encerramento da compra pelo aplicativo, preparando para um checkout expresso.

### Para Administradores de Mercado (via API)
- **Gerenciamento de Catálogo**: CRUD completo de produtos, restrito ao seu próprio mercado.
- **Gerenciamento de Frota**: Adição e remoção de carrinhos físicos do sistema.
- **Autenticação e Autorização**: Acesso seguro a rotas administrativas através de um perfil (`role`) específico.

## 🏗️ Arquitetura do Sistema

O projeto é dividido em três componentes principais que se comunicam para criar uma experiência coesa:

### 1. Backend (API Restful) - *Concluído*
O cérebro do sistema. Desenvolvido em **Node.js com Express**, ele é responsável por:
- Gerenciar toda a lógica de negócio.
- Controlar o acesso e a autenticação de clientes e administradores.
- Persistir os dados em um banco de dados **SQLite**.
- Simular uma arquitetura multi-tenant, com dados de mercados distintos e um script de sincronização.

### 2. Frontend (Aplicativo Mobile) - *Em Desenvolvimento*
A principal interface de interação para o cliente. Será desenvolvido em **React Native** e terá como funções:
- Permitir que o usuário se cadastre e faça login.
- Usar a câmera para escanear QR Codes (do carrinho) e códigos de barras (dos produtos).
- Exibir a lista de compras e o valor total em tempo real, consumindo os dados da API.
- Permitir a finalização da compra.

### 3. Firmware (Hardware Embarcado) - *Em Desenvolvimento*
A inteligência acoplada ao carrinho físico. Será programado em **C/C++ (Arduino Core)** para o microcontrolador **ESP32** e será responsável por:
- Conectar-se à rede Wi-Fi para se comunicar com o backend.
- Ler dados de periféricos, como um leitor de código de barras **GM65** e células de carga para a balança.
- Enviar os dados coletados para a API e receber confirmações.
- (Opcional) Hospedar uma interface web simples para uma tela acoplada.

## 🛠️ Tecnologias Utilizadas
### Backend
- **Node.js** com **Express.js**
- **Sequelize** como ORM
- **SQLite** como banco de dados
- **JSON Web Tokens (JWT)** para autenticação
- **Bcrypt.js** para hashing de senhas

### Frontend (Planejado)
- **React Native**
- **Expo** para simplificar o desenvolvimento

### Firmware (Planejado)
- **C/C++ (Arduino Core)**
- **ESP32 (NodeMCU)** como microcontrolador principal

## 📂 Estrutura do Projeto
```
backend/
├── config/
│   └── config.json              # Configurações de conexão para todos os bancos de dados
├── databases/
│   ├── autocart/                # Sistema Central
│   │   ├── autocart_db.sqlite
│   │   ├── migrations/
│   │   └── models/
│   └── mercados/                # Sistemas Externos Simulados
│       ├── mercado_a.sqlite
│       ├── mercado_b.sqlite
│       ├── migrations/
│       └── models/
├── node_modules/
├── src/
│   ├── database/index.js        # Inicializa as conexões do Sequelize
│   ├── middlewares/auth.js      # Middlewares de autenticação (verifyAdmin, verifyClient)
│   ├── routes/                  # Definição de todas as rotas da API
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── compraRoutes.js
│   ├── scripts/syncProducts.js  # Script para sincronizar produtos
│   └── server.js                # Ponto de entrada da aplicação Express
├── .sequelizerc                 # Configura os caminhos para o Sequelize CLI
└── package.json                 # Metadados e dependências do projeto
```

## 🚀 Começando (Configurando o Backend)

Atualmente, apenas o backend está funcional. Siga os passos abaixo para executá-lo.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18.x ou superior)
- [npm](https://www.npmjs.com/)

### Instalação
1.  **Clone o repositório e entre na pasta do backend:**
    ```bash
    git clone https://github.com/DomynicBl/AutoCart
    cd AutoCart/backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Crie as tabelas dos bancos de dados:**
    ```bash
    npx sequelize-cli db:migrate --env autocart
    npx sequelize-cli db:migrate --env mercadoA
    npx sequelize-cli db:migrate --env mercadoB
    ```
4.  **Popule os bancos com dados iniciais:**
    *(Lembre-se de substituir `<NOME_DO_ARQUIVO>` pelos nomes reais na sua pasta `seeders`)*
    ```bash
    npx sequelize-cli db:seed --seed <...>-popular-carrinhos.js --env autocart
    npx sequelize-cli db:seed --seed <...>-popular-produtos-mercadoA.js --env mercadoA
    npx sequelize-cli db:seed --seed <...>-popular-produtos-mercadoB.js --env mercadoB
    ```
5.  **Sincronize os produtos dos mercados para o banco central:**
    ```bash
    node src/scripts/syncProducts.js
    ```
### Executando o Servidor
Para iniciar o servidor em modo de desenvolvimento (com reinicialização automática):
```bash
npm run dev
```

O servidor estará disponível em http://localhost:3333.


🧑‍💻 Autores

- [Domynic Barros Lima](https://github.com/DomynicBl/)
- [SobrJuan Pablo Ramos de Oliveira](https://github.com/Juanpablozim/)
- [Luis Fernando Rodrigues Braga](https://github.com/Trinalsolid)
- [Thiago Teixeira Oliveira]()
