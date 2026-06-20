# Creapes Platform

Plataforma de cliente para agências de vídeo. Dashboard estilo Netflix, aprovação por timecode, comentários, Gantt e galeria de arquivos.

## Stack
- **Frontend**: React + Vite
- **Backend**: Flask + SQLAlchemy
- **Banco**: PostgreSQL
- **Deploy**: Docker + docker-compose

## Estrutura
```
creapes-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # App factory
│   │   ├── config.py         # Configurações
│   │   ├── models/           # SQLAlchemy models
│   │   └── routes/           # Blueprints Flask
│   ├── run.py                # Entry point + CLI commands
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/            # Dashboard, Projects, Player, Files, Settings
│   │   ├── components/       # Sidebar, UI components
│   │   ├── services/api.js   # Axios + todas as chamadas à API
│   │   ├── context/          # AppContext (client, projeto, versão)
│   │   └── App.jsx           # Roteamento
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml
```

## Rodar local

```bash
# Subir tudo
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/clients/ | Listar clientes |
| POST | /api/clients/ | Criar cliente |
| GET | /api/projects/?client_id=1 | Projetos por cliente |
| GET | /api/projects/:id | Projeto com versões |
| GET | /api/versions/?project_id=1 | Versões de um projeto |
| GET | /api/versions/:id | Versão com comentários e aprovações |
| POST | /api/comments/ | Criar comentário com timecode |
| POST | /api/approvals/ | Aprovar/reprovar versão |
| GET | /api/assets/?project_id=1 | Assets de um projeto |
| POST | /api/assets/ | Criar asset |

## Models

- **Client**: name, logo_url, accent_color, slug
- **Project**: client_id, title, description, thumbnail_url, status
- **Version**: project_id, label, video_url, vimeo_id, status
- **Comment**: version_id, author_name, text, timecode
- **Approval**: version_id, author_name, decision, note
- **Asset**: project_id, name, file_url, file_type, size_bytes

## Status de projeto
- `em_andamento`
- `pendente_aprovacao`
- `aprovado`
- `bloqueado`

## Status de versão
- `pendente`
- `aprovado`
- `reprovado`
- `aprovado_com_ressalva`

## Próximos passos
- [ ] Autenticação JWT com roles (cliente / agência / editor)
- [ ] Upload real com Cloudinary
- [ ] Gantt completo com drag-and-drop
- [ ] Notificações por email/WhatsApp
- [ ] White-label por slug de cliente (`/c/:slug`)
