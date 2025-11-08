# Express API

Una piccola API REST costruita con Express.js e TypeScript seguendo le migliori pratiche di architettura.

## Funzionalità

- ✅ Architettura MVC (Model-View-Controller)
- ✅ Middleware per gestione errori e validazione
- ✅ CRUD completo per utenti
- ✅ Validazione dei dati in ingresso
- ✅ Logging delle richieste
- ✅ Middleware di sicurezza (Helmet, CORS)
- ✅ TypeScript per type safety
- ✅ Integrazione con database relazionale (PostgreSQL)
- ✅ Docker containerization

## Struttura del Progetto

```text
src/
├── config/         # Configurazioni dell'applicazione
├── controllers/    # Logica di business per le route
├── middleware/     # Middleware personalizzati
├── models/         # Definizioni dei tipi/modelli
├── repositories/   # Accesso ai dati e logica di persistenza
├── routes/         # Definizioni delle route
├── scripts/        # Script di utilità
├── services/       # Logica di business e accesso dati
├── utils/          # Funzioni di utilità
└── app.ts          # Configurazione principale dell'app
```

## Configurazione delle variabili d'ambiente

Tutte le variabili d'ambiente sono centralizzate in un file `.env` (non tracciato) e in `.env.example` (template condivisibile senza dati sensibili).

**Best practice:**

- Modifica `.env` per lo sviluppo locale e Docker Compose lo caricherà automaticamente grazie alla direttiva `env_file`.
- Non committare `.env` con dati reali, ma solo `.env.example`.
- In produzione puoi usare un file `.env.prod` e cambiare la riga in `env_file: .env.prod`.

Esempio di `.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=expressdb
DB_SSL=false
CORS_ORIGINS=http://localhost:3000
```

Estratto da `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .env
    # ...
  db:
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=expressdb
```

## Installazione e Avvio

### 1. Avvia i container

Per avviare sia il database che l'applicazione Express in ambiente di sviluppo **o** produzione:

```bash
docker compose up
```

Questo comando avvia sia il database che l'applicazione Express in container separati, secondo la configurazione di `docker-compose.yml`.

### 2. Inizializza il database (solo la prima volta)

Per creare le tabelle e i dati di esempio, esegui lo script di inizializzazione:

```bash
npm run db:init
```

Assicurati che il database sia già in esecuzione prima di lanciare questo comando.

## Endpoint API

### Health Check

- `GET /api/health` - Controllo stato API
- `GET /api/health/detailed` - Controllo dettagliato

### Utenti

- `GET /api/users` - Ottieni tutti gli utenti
- `GET /api/users/:id` - Ottieni un utente per ID
- `POST /api/users` - Crea un nuovo utente
- `PUT /api/users/:id` - Aggiorna un utente
- `DELETE /api/users/:id` - Elimina un utente

## Testing

Per testare l'API puoi utilizzare:

- **REST Client** (consigliato):
  - Installa l'estensione "REST Client" su VS Code.
  - Apri il file `api-tests.http` presente nella root del progetto.
  - Clicca su "Send Request" sopra ogni richiesta per eseguirla e vedere la risposta direttamente nell'editor.

- **Postman** o **Insomnia** per test manuali
- **curl** da linea di comando
- **Thunder Client** extension

## Prossimi Sviluppi

- [ ] Autenticazione JWT
- [ ] Rate limiting
- [ ] Test automatizzati
- [ ] Documentazione Swagger/OpenAPI
- [ ] Logging avanzato con Winston

## Licenza

MIT
