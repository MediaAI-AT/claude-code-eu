#!/usr/bin/env node
// Interaktiver Provider-Switcher für Claude Code

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const CLAUDE_DIR = path.join(__dirname, ".claude");
const SETTINGS_TARGET = path.join(CLAUDE_DIR, "settings.json");

const PROVIDERS = [
  {
    key: "aws-bedrock",
    label: "AWS Bedrock (Frankfurt, eu-central-1)",
    file: "settings.aws-bedrock.json",
    dsgvo: true,
    note: "Benötigt: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY",
    extra: () => {
      console.log("\n  Tipp: Credentials setzen mit:");
      console.log("  export AWS_ACCESS_KEY_ID=...");
      console.log("  export AWS_SECRET_ACCESS_KEY=...");
    },
  },
  {
    key: "azure-litellm",
    label: "Azure OpenAI via LiteLLM-Proxy (lokal)",
    file: "settings.azure-litellm.json",
    dsgvo: true,
    note: "Benötigt: LiteLLM-Proxy laufend auf Port 4000",
    extra: () => {
      console.log("\n  Proxy starten mit: node start-litellm.js");
      console.log("  Credentials: cp setenv-azure.example.sh setenv-azure.sh && nano setenv-azure.sh");
    },
  },
  {
    key: "groq-eu",
    label: "Groq (EU-Infrastruktur via LiteLLM)",
    file: "settings.groq-eu.json",
    dsgvo: true,
    note: "Benötigt: GROQ_API_KEY, LiteLLM-Proxy auf Port 4000",
    extra: () => {
      console.log("\n  API-Key: https://console.groq.com");
      console.log("  Credentials: cp setenv-groq.example.sh setenv-groq.sh && nano setenv-groq.sh");
    },
  },
  {
    key: "ollama-local",
    label: "Ollama (lokal, maximale Privatsphäre)",
    file: "settings.ollama-local.json",
    dsgvo: true,
    note: "Benötigt: Ollama installiert und laufend",
    extra: () => {
      console.log("\n  Ollama starten: ollama serve");
      console.log("  Modell laden:   ollama pull llama3");
    },
  },
  {
    key: "ollama-remote",
    label: "Ollama (self-hosted Server)",
    file: "settings.ollama-remote.json",
    dsgvo: true,
    note: "Benötigt: OLLAMA_HOST gesetzt auf deinen Server",
    extra: () => {
      console.log("\n  Host setzen: export OLLAMA_HOST=https://ollama.mein-server.de");
    },
  },
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function printHeader() {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║         Claude Code EU — Provider Setup              ║");
  console.log("║         DSGVO-konformes KI-Coding in Europa          ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");
}

function printProviders() {
  PROVIDERS.forEach((p, i) => {
    const dsgvo = p.dsgvo ? "✓ DSGVO" : "✗";
    console.log(`  [${i + 1}] ${p.label}`);
    console.log(`      ${dsgvo} | ${p.note}\n`);
  });
}

function getCurrentProvider() {
  if (!fs.existsSync(SETTINGS_TARGET)) return null;
  const current = fs.readFileSync(SETTINGS_TARGET, "utf8");
  for (const p of PROVIDERS) {
    const templatePath = path.join(CLAUDE_DIR, p.file);
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, "utf8");
      if (current.trim() === template.trim()) return p.label;
    }
  }
  return "Unbekannt (manuell bearbeitet)";
}

async function main() {
  printHeader();

  const current = getCurrentProvider();
  if (current) {
    console.log(`  Aktueller Provider: ${current}\n`);
  }

  console.log("  Verfügbare Provider:\n");
  printProviders();

  const answer = await ask("  Auswahl (1-5) oder [q]uit: ");

  if (answer.toLowerCase() === "q") {
    console.log("\n  Abgebrochen.\n");
    rl.close();
    return;
  }

  const idx = parseInt(answer) - 1;
  if (isNaN(idx) || idx < 0 || idx >= PROVIDERS.length) {
    console.log("\n  Ungültige Auswahl.\n");
    rl.close();
    return;
  }

  const chosen = PROVIDERS[idx];
  const sourcePath = path.join(CLAUDE_DIR, chosen.file);

  if (!fs.existsSync(sourcePath)) {
    console.log(`\n  Fehler: ${sourcePath} nicht gefunden.\n`);
    rl.close();
    return;
  }

  fs.copyFileSync(sourcePath, SETTINGS_TARGET);

  console.log(`\n  ✓ Provider gewechselt zu: ${chosen.label}`);
  console.log(`  ✓ Geschrieben nach: .claude/settings.json`);

  chosen.extra();

  console.log("\n  Claude Code neu starten, damit die Einstellungen greifen.");
  console.log("  Danach: claude (im Projektverzeichnis)\n");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
