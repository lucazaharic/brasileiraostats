# Brasileirao Stats - Sistema de Estatísticas do Campeonato Brasileiro

Sistema completo com Backend (Java/Spring Boot) e Frontend (HTML/JavaScript/Bootstrap) para gerenciamento de estatísticas do Campeonato Brasileiro.

## Estrutura do Projeto

```
G:\Projeto\
├── pom.xml                          # Maven (Backend)
├── src\main\java\com\brasileirao\api\
│   ├── BrasileiraoApplication.java   # Classe principal
│   └── player\
│       ├── Player.java              # Entidade
│       ├── PlayerRepository.java    # Repositório
│       ├── PlayerService.java       # Lógica de negócio
│       └── PlayerController.java   # Endpoints REST
├── src\main\resources\
│   └── application.properties       # Configurações
├── frontend\
│   ├── index.html                  # Página principal
│   ├── css\
│   │   └── styles.css              # Estilos customizados
│   ├── js\
│   │   └── app.js                  # JavaScript da aplicação
│   └── images\
│       ├── jogadores\              # Fotos dos jogadores (opcional)
│       └── clubes\                 # Escudos dos clubes (opcional)
└── README.md
```

## Quick Start

### 1. Backend (Spring Boot)

```bash
# Criar banco de dados no PostgreSQL
CREATE DATABASE brasileirao_db;

# Compilar e executar
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### 2. Frontend (HTML/JS)

Abrir o arquivo `frontend/index.html` em um navegador.

**Nota:** Para evitar problemas de CORS, é recomendado usar um servidor HTTP local:

```bash
# Com Python (na pasta frontend)
python -m http.server 3000

# Com Node.js (npx)
npx serve .

# Com PHP
php -S localhost:3000
```

Depois acessar: `http://localhost:3000`

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/jogadores` | Lista todos os jogadores |
| GET | `/api/v1/jogadores?clube=X` | Filtra por clube |
| GET | `/api/v1/jogadores?posicao=X` | Filtra por posição |
| GET | `/api/v1/jogadores?nome=X` | Busca por nome |
| GET | `/api/v1/jogadores/{id}` | Busca jogador por ID |
| POST | `/api/v1/jogadores` | Cadastra novo jogador |
| PUT | `/api/v1/jogadores/{id}` | Atualiza jogador |
| DELETE | `/api/v1/jogadores/{id}` | Remove jogador |
| GET | `/api/v1/jogadores/clubes` | Lista clubes distintos |

## Imagens dos Jogadores e Clubes

O sistema usa **TheSportsDB API** para escudos dos clubes (automático) e **ui-avatars.com** como fallback para jogadores.

### Escudos dos Clubes
Os escudos são carregados automaticamente da [TheSportsDB API](https://www.thesportsdb.com/league/4351) para todos os 20 clubes do Brasileirão.

### Fotos dos Jogadores
Para fotos oficiais dos jogadores, você tem estas opções:

1. **Armazenamento Local** (recomendado para início)
   - Salvar em `frontend/images/jogadores/`
   - Formato: `nome-do-jogador.jpg`
   - Exemplo: `gabriel-barbosa.jpg`
   - O JavaScript formata o nome automaticamente

2. **APIs Externas** (para produção)
   - [BDFutbol Photos API](https://www.api-bdfutbol.com/en/photos-api/) - €25/mês
   - [SportsAPI Pro](https://docs.sportsapipro.com/api-reference/images) - Plano gratuito disponível

O fallback atual usa [ui-avatars.com](https://ui-avatars.com) para gerar avatares com as iniciais do nome.

## Tecnologias

### Backend
- Java 21
- Spring Boot 3.2.5
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- HTML5
- CSS3 (Bootstrap 5.3)
- JavaScript ES6+
- Bootstrap 5.3
- Bootstrap Icons
- Google Fonts (Inter)
- API Externa: ui-avatars.com (fallback)

## Funcionalidades

- [x] Listar todos os jogadores
- [x] Filtrar por clube
- [x] Filtrar por posição
- [x] Buscar por nome
- [x] Visualizar detalhes do jogador
- [x] Cadastrar novo jogador
- [x] Editar jogador existente
- [x] Excluir jogador
- [x] Listar clubes distintos
- [x] Exibir estatísticas gerais (total jogadores, clubes, gols)
- [x] Responsivo para mobile
- [x] Fotos de jogadores (com fallback)
- [x] Escudos dos clubes (com fallback)
