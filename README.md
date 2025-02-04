# Myelin · [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Translation infrastructure that sparks joy** ✨

Myelin seamlessly integrates localization into your development process, freeing you to prioritize building exceptional user experiences while minimizing time spent on translation tasks.

```bash
npx myelino --translate
```

## Features

- **🔒 Local First & Private**  
  Translation calls happen on your machine. We never send your data to third-party APIs or external databases.

- **🌍 Open Source**  
  Every line of code is transparent and available on GitHub.

- **🆓 Free Forever**  
  No hidden costs. Now and always.

- **🤖 Multi-Model Support**  
  Choose from `openai`, `deepseek`, `moonshot`, `qwen`, or bring your own model.

- **📚 First-Class i18n Library Support**  
  Works seamlessly with `next-intl`, `react-intl`, `react-i18next`, and more.

- **🗂 Namespace Support**  
  Supports both namespaced and non-namespaced structures out of the box.

## Quick Start

1. **Install Myelin**  
   Ensure Node.js (v18+) is installed, then run:

   ```bash
   npx myelino --init
   ```

2. **Configure**  
   Create `myelin.config.json` in your project root:

   ```json
   {
     "aiProvider": "deepseek",
     "aiModel": "deepseek-chat",
     "locale": {
       "location": "locales",
       "sourceLanguage": "en",
       "targetLanguages": ["es", "fr", "zh", "zh-TW", "en-US"]
     }
   }
   ```

3. **Add API Key**  
   Create a `.env` file with your AI provider key:

   ```env
   AI_API_KEY=sk-proj-your-api-key
   ```

4. **Translate!**  
   Run the translation command:
   ```bash
   npx myelino --translate
   ```
   Myelin scans your source locale file (e.g., `locales/en.json`), translates new/missing strings, and updates target files (e.g., `locales/fr.json`).

## Configuration Guide

### `myelin.config.json`

| Key                      | Description                 | Example                      |
| ------------------------ | --------------------------- | ---------------------------- |
| `aiProvider`             | AI service provider         | `"openai"`, `"deepseek"`     |
| `aiModel`                | Model ID for the provider   | `"deepseek-chat"`, `"gpt-4"` |
| `locale.location`        | Path to locale directory    | `"src/locales"`              |
| `locale.sourceLanguage`  | Base language (ISO 639-1)   | `"en"`                       |
| `locale.targetLanguages` | Languages to translate into | `["es", "zh-TW"]`            |

### Supported Providers

- OpenAI
- DeepSeek
- Moonshot
- Qwen

**Bring Your Own Model**: Custom providers can be integrated via the open-source codebase.

---
