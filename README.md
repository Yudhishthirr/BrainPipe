# 🚀 BrainPipe – AI Workflow Automation Platform

An AI-powered workflow automation platform inspired by tools like n8n, enabling users to create powerful task pipelines by connecting modular nodes.

---

## ✨ Overview

BrainPipe allows users to visually build and manage automation workflows by linking nodes together. Each node performs a specific task—such as calling an AI model, processing data, or integrating external services.

The platform is designed to be flexible, scalable, and extensible with support for multiple AI providers.

---

## 🧠 Features

* 🔗 **Node-Based Workflow Builder**
  Create complex pipelines using modular, connectable nodes

* 🤖 **Multi-AI Integration**
  Supports OpenAI, Anthropic, and Gemini

* 🌐 **External Model Support**
  Extend functionality using Replicate-hosted models

* ⚡ **Dynamic Task Execution**
  Execute workflows in real-time

* 🏗️ **Scalable Architecture**
  Built using modern full-stack technologies

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, TypeScript
* **Backend:** Next.js (API Routes / Server Actions)
* **AI Providers:** OpenAI, Anthropic, Gemini
* **External Models:** Replicate

---

## 📸 Screenshot

![BrainPipe Screenshot](https://github.com/Yudhishthirr/BrainPipe/blob/main/public/brainpipe.png)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Yudhishthirr/BrainPipe.git
cd BrainPipe
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
REPLICATE_API_TOKEN=your_replicate_token
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📂 Project Structure

```
/app
/components
/features/workflows
/lib
/public
```

---

## 🧩 How It Works

1. Users create workflows using a node-based visual interface
2. Each node represents a task (AI call, transformation, etc.)
3. Nodes are connected to form execution pipelines
4. The system executes workflows step-by-step

---

## 🌍 Future Improvements

* Drag-and-drop UI enhancements
* More third-party integrations
* Workflow templates
* Real-time collaboration

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 💡 Inspiration

Inspired by workflow automation tools like n8n, enhanced with modern AI capabilities.
