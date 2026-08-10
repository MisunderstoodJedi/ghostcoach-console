# Training Command Center

A personal 31-week HYROX training planner and tracker. It starts on 10 August 2026 and builds toward HYROX race day on 10 March 2027.

## What It Does

- Shows the current week, today's planned session, readiness and basic progress cards.
- Keeps the supplied 8-week 5K schedule exactly as written.
- Keeps the supplied 8-week 10K schedule exactly as written.
- Adds weeks 17-31 as a simple HYROX build with strength, core, body-composition work, compromised running, station practice, specific gym exposure and taper.
- Lets you edit any week without changing the core plan generator.
- Saves daily check-ins, simplified workout logs, exercise tick-offs, short reflections and weekly reviews.
- Works local-first in the browser and can also sync one JSON state document through the optional API.
- Publishes the generated routine feed at `/routines.json` and `/exports/routines.json`.

## Project Shape

- `index.html` provides the single-page app shell and section navigation.
- `styles.css` contains the responsive dashboard, forms, tables and cards.
- `app.js` contains the 31-week plan, state model, render logic, readiness scoring and save flow.
- `backend/server.js` stores one JSON progress document per profile in MySQL.
- `docker-compose.yml` runs MySQL, the API and nginx frontend on port `3344`.
- `tools/export-routines.js` generates the routine export from the programme rules.

## Persistence

The frontend writes to `hyroxPlannerState` in local storage. It still reads the old `trainingCommandCenterState` and `hyroxProtocolState` keys so existing browser progress can migrate cleanly on first load.

The backend keeps the existing database/container names for deployment compatibility, but user-facing labels are neutral training labels.

## Open

Create local Docker credentials first:

```bash
cp .env.example .env
```

Then edit `.env` and choose local database passwords. The `.env` file is ignored by Git.

Start the full stack:

```bash
docker compose up -d --build
```

Then visit the server address:

```text
http://192.168.8.209:3344
```

Regenerate the routine feed after changing the plan rules:

```bash
node tools/export-routines.js
```

For frontend-only development on the server when the Docker stack is not running:

```bash
python3 -m http.server 8091
```

Then visit from the network:

```text
http://192.168.8.209:8091
```

## Services

| Container | Role | Port |
| --- | --- | --- |
| ghostcoach_console_web | nginx + frontend | 192.168.8.209:3344 |
| ghostcoach_console_api | Node.js REST API | internal 4000 |
| ghostcoach_console_db | MySQL 8 | internal |

## Commands

```bash
# Start or rebuild
docker compose up -d --build

# Logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove saved progress
docker compose down -v
```

## Notes

This is a training planner and personal logging tool, not medical advice. Build gradually, stop for sharp pain and get medical clearance if there are health concerns.
