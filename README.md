# 🦇 WayneTech Performance Dashboard

> Sistema Fullstack para Gestão Pessoal e Métricas de Treino.


## 📋 Sobre o Projeto

O **WayneTech Dashboard** é uma aplicação web completa desenvolvida para centralizar a gestão de rotinas de treinos de musculação, protocolos de estudo e diários.

Diferente de simples listas de tarefas, implementando conceitos de **Auto-Correção (Self-Healing)** no banco de dados e uma interface dinâmica em componentes reutilizáveis.

O projeto foi construído para resolver um problema real de organização de dados complexos (Séries, Cargas, Horários, estudos e memória) em uma única interface coesa e responsiva.

## 🚀 Stack Tecnológica

O projeto utiliza uma arquitetura moderna baseada em JavaScript/TypeScript de ponta a ponta:

### Frontend (Client-Side)
-   **React 18:** Construção de interfaces reativas e modulares.
-   **TypeScript:** Tipagem estática para garantir integridade dos dados e redução de bugs.
-   **Tailwind CSS:** Estilização utilitária para design responsivo e consistente.
-   **Lucide React:** Biblioteca de ícones vetoriais otimizada.
-   **Vite:** Build tool de alta performance.

### Backend (Server-Side)
-   **Node.js & Express:** API RESTful robusta para gestão de requisições.
-   **Prisma ORM:** Abstração de banco de dados e modelagem de esquemas relacionais.
-   **PostgreSQL:** Banco de dados relacional para persistência segura.
-   **JWT (JSON Web Token):** Sistema de autenticação e segurança de rotas protegidas.

### Infraestrutura & DevOps
-   **Render:** Deploy contínuo (CI/CD) de Frontend e Backend.
-   **Github:** Controle de versão e fluxo de trabalho.

## ⚙️ Arquitetura e Diferenciais Técnicos

### 1. Sistema de "Auto-Gênese" (Self-Healing Database)
Um dos maiores desafios foi garantir a integridade dos dados iniciais do usuário. Implementei um algoritmo no Backend que verifica a consistência do banco ao carregar a aplicação. Se detectar anomalias ou ausência de dados críticos (como o template de treinos padrão), o sistema executa automaticamente uma **restauração**, limpando dados corrompidos e recriando a estrutura correta sem intervenção manual.

### 2. Modelagem Relacional
O banco de dados não é uma lista plana. Utilizei o **Prisma** para modelar relacionamentos reais:
-   `User` possui múltiplos `Workout`
-   `Workout` possui múltiplos `Exercise`
-   `Protocol` (Cursos) possui múltiplas `Lesson` (Aulas)
Isso permite consultas otimizadas e garante que, ao deletar um usuário ou treino, os dados órfãos sejam tratados corretamente (Cascade Delete).

### 3. Módulo "Oracle" (Gestão de Conhecimento)
Sistema interno para cadastro e consumo de cursos em vídeo. Permite adicionar links externos (YouTube), gerenciar status de conclusão e editar metadados em tempo real, transformando o dashboard em uma plataforma de ensino (LMS) particular.

### 4. Segurança e Autenticação
Implementação de Middleware de Autenticação no Express. Todas as rotas sensíveis (`/workouts`, `/routine`, `/protocols`) exigem um Token JWT válido no Header, garantindo que cada usuário acesse apenas os seus próprios dados (Row Level Security lógica).

#Screenshots

<img width="1914" height="994" alt="image" src="https://github.com/user-attachments/assets/c99f889b-751f-4e3f-a246-a0439fb41eba" />

<img width="1914" height="994" alt="image" src="https://github.com/user-attachments/assets/299fd416-3b0e-4215-8e36-3b7edce3fe13" />

<img width="1917" height="994" alt="image" src="https://github.com/user-attachments/assets/4524a97a-f903-45d8-b187-18da55711e57" />

<img width="1915" height="994" alt="image" src="https://github.com/user-attachments/assets/37705879-bdcb-4f71-857c-37ceaaa410ed" />

<img width="1918" height="995" alt="image" src="https://github.com/user-attachments/assets/83b69090-e5fe-4bc0-a58e-2e441cb695ee" />

<img width="1916" height="993" alt="image" src="https://github.com/user-attachments/assets/76e679de-1890-4a80-a0db-39daf66dfea8" />

<img width="1916" height="992" alt="image" src="https://github.com/user-attachments/assets/731afb5c-cb4f-41ea-99ce-6e7ba4fcb4a1" />

<img width="1917" height="993" alt="image" src="https://github.com/user-attachments/assets/0945120e-5d52-49bf-bd0d-38ce2ca5636f" />

<img width="1915" height="987" alt="image" src="https://github.com/user-attachments/assets/ce1f59af-460d-482f-a7cc-2dacc794a9b0" />

<img width="1917" height="994" alt="image" src="https://github.com/user-attachments/assets/0c8d49ed-6f66-49b9-b669-1a34dbaa3bce" />






*Projeto desenvolvido para fins de estudo e aplicação prática de conceitos de Engenharia de Software.*
