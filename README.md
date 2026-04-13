# Coworker AI Agent

Coworker is an AI-powered coding and file management assistant. it provides both a Command Line Interface (CLI) and a modern desktop application built with Electron and React.

## Features

- **File Operations**: List files, read content, write/update files, and search for patterns across the project.
- **Autonomous Reasoning**: Uses an orchestration loop to handle complex tasks by iteratively calling tools and reasoning.
- **Dual Interface**:
    - **CLI**: Fast and lightweight terminal-based interaction.
    - **Electron App**: Modern graphical interface with React 19 and real-time updates.
- **AI Backend**: Powered by OpenRouter (defaulting to Nemotron 3).

## Prerequisites

- **Node.js**: Version 20 or higher recommended.
- **OpenRouter API Key**: You need an API key from [OpenRouter](https://openrouter.ai/).

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Configuration

Create a `.env` file in the project root and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Build

Compile the TypeScript source and build the React frontend:

```bash
npm run build
```

## Usage

### Running the CLI

To start the terminal-based assistant:

```bash
npm run start:cli
```

### Running the Electron App

To launch the desktop application:

```bash
npm run start:electron
```
Alternatively, you can use the shortcut:
```bash
npm start
```

## Project Structure

- `src/agent.ts`: Core AI agent logic and orchestration loop.
- `src/tools.ts`: Implementation of file system tools.
- `src/cli.ts`: Entry point for the CLI interface.
- `src/main.ts`: Electron main process.
- `src/renderer/`: React-based frontend source code.
- `dist/`: Compiled assets and executables.

## License

Apache-2.0
