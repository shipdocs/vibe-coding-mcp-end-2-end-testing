# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a Node.js program that sets up an MCP (Model Context Protocol) server and runs Puppeteer-based browser automation tests on target websites. The tool integrates with VSCode AI extensions like Roo-Code and Augment via the MCP protocol, allowing for AI-guided testing and analysis.

## Command Reference

### Setup and Installation

```bash
# Navigate to the project directory
cd mcp-puppeteer-test

# Install dependencies
npm install
```

### Running the Application

```bash
# Run the main application
node index.js
```

On the first run, if `config.json` is not found, the program will prompt for configuration values.

## Project Architecture

The project has a simple structure but implements powerful functionality for web testing and AI integration:

1. **Configuration Management**: The application uses a `config.json` file to store login URLs, credentials, CSS selectors, and MCP server settings. If the file doesn't exist, it prompts the user for input.

2. **MCP Server Integration**: The application implements an MCP server (currently stubbed in the code) that would expose HTTP endpoints for resources and commands following the Model Context Protocol conventions. This allows integration with AI extensions like Roo-Code and Augment.

3. **Puppeteer Testing**: The core functionality uses Puppeteer to:
   - Login to target websites
   - Navigate to specific pages
   - Capture screenshots
   - Perform automated testing and analysis
   
4. **Error Handling and Reporting**: The application logs errors and test results that can be consumed by AI extensions for analysis.

## Key Files

- `index.js`: Main application entry point that coordinates configuration loading, MCP server setup, and test execution
- `config.json`: Configuration file storing URLs, credentials, selectors, and server settings

## Development Guidelines

When working with this codebase:

1. Keep sensitive information like credentials out of the committed code. The example `config.json` uses placeholders.

2. The MCP server implementation is currently a stub. Enhancements should follow the Model Context Protocol specifications.

3. Puppeteer runs with security sandbox disabled (`--no-sandbox` and `--disable-setuid-sandbox` flags) for compatibility. Consider security implications when modifying the browser launch settings.

4. Any additional functionality should maintain compatibility with Roo-Code and Augment AI extensions that may interact with the MCP server.