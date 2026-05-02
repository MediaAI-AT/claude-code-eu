# claude-code-eu

DSGVO-konformes Claude Code Starter-Kit — KI-gestützte Code-Analyse vollständig innerhalb Europas oder lokal.

🇬🇧 [English version](README.md)

---

## Was ist das?

Claude Code ist standardmäßig über Anthropics US-Server geroutet. Dieses Kit zeigt, wie du Claude Code über **DSGVO-konforme Provider** betreibst — mit Auftragsverarbeitungsverträgen, EU-Datenspeicherung oder vollständig lokal.

## Unterstützte Provider

| Provider | Rechenzentrum | DSGVO | Kosten |
|---|---|---|---|
| AWS Bedrock | Frankfurt (eu-central-1) | ✓ AVV möglich | Pay-per-use |
| Azure OpenAI via LiteLLM | EU-Regionen wählbar | ✓ AVV möglich | Pay-per-use |
| Groq via LiteLLM | EU-Infrastruktur | ✓ AVV möglich | Freemium |
| Ollama lokal | Dein Rechner | ✓ Kein Transfer | Kostenlos |
| Ollama self-hosted | Dein Server | ✓ Volle Kontrolle | Infrastrukturkosten |

## Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Interaktiven Provider-Switcher starten
npm run setup

# 3. Claude Code starten
claude
```

## Provider wechseln

```bash
npm run setup
```

Der interaktive CLI zeigt alle Provider mit Anforderungen und gibt nach der Auswahl die nötigen nächsten Schritte aus.

Alternativ manuell:
```bash
cp .claude/settings.aws-bedrock.json .claude/settings.json
```

## AWS Bedrock (Frankfurt)

1. AWS-Account mit Bedrock-Zugang in `eu-central-1` einrichten
2. Modell-Zugang für `anthropic.claude-sonnet-4-6-20250514-v1:0` aktivieren
3. IAM-Credentials setzen:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
npm run setup  # Option 1 wählen
```

## Azure OpenAI via LiteLLM

1. Azure OpenAI in einer EU-Region deployen (z.B. `swedencentral`, `francecentral`)
2. Credentials setzen:

```bash
cp setenv-azure.example.sh setenv-azure.sh
# setenv-azure.sh bearbeiten
source setenv-azure.sh
```

3. LiteLLM-Proxy starten:

```bash
pip install litellm
litellm --config litellm/config.yaml
```

4. Provider wählen: `npm run setup` → Option 2

## Groq via LiteLLM

1. API-Key erstellen: https://console.groq.com/keys
2. Credentials setzen:

```bash
cp setenv-groq.example.sh setenv-groq.sh
# setenv-groq.sh bearbeiten
source setenv-groq.sh
```

3. LiteLLM-Proxy starten:

```bash
litellm --config litellm/config.yaml
```

4. Provider wählen: `npm run setup` → Option 3

## Ollama (lokal)

```bash
# Ollama installieren: https://ollama.com
ollama pull llama3
ollama serve

npm run setup  # Option 4 wählen
```

## Demo: Code-Review mit Claude

```bash
# Demo-App analysieren (enthält absichtliche Sicherheitsprobleme)
cat prompt.txt | claude
```

Oder direkt in Claude Code:
```
> Analysiere app.js auf Sicherheitsprobleme
```

## Demo-App (`app.js`)

Die enthaltene Express-App ist ein User-Management-API mit **absichtlich eingebauten Problemen** — als Testfall für den Code-Review:

- Passwörter werden im Klartext geloggt
- Hardcodierter Secret-Key im Quellcode
- Kein Input-Validation (fehlerhafter Array-Zugriff)
- CORS für alle Origins offen
- Server läuft auf `0.0.0.0` ohne Auth-Middleware

## DSGVO-Hinweis

Dieses Kit adressiert nur den **technischen Infrastruktur-Aspekt** der DSGVO. Vollständige Compliance erfordert zusätzlich:

- Abgeschlossene Auftragsverarbeitungsverträge (AVV) mit dem Provider
- Verarbeitungsverzeichnis für KI-gestützte Prozesse
- Datenschutz-Folgenabschätzung (DSFA) bei risikoreichen Verarbeitungen
- Einbindung des Datenschutzbeauftragten

---

Inspiriert von [claude-code-dsgvo](https://github.com/require-gio/claude-code-dsgvo) — eigenständige Neuimplementierung mit Node.js, interaktivem CLI und Groq-Support.
