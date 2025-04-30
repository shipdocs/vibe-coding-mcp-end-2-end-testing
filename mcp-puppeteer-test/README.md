# MCP Puppeteer Test

This project is a Node.js program designed to automatically set up an MCP server (or proxy server) and run Puppeteer-based browser automation tests on a target website. It supports dynamic websites including React apps, performs error detection, usability checks, and logs detailed notes for further analysis and repair using an LLM.

## Features

- Automatic MCP server setup (stub implementation, extendable)
- Puppeteer automation for login, navigation, and analysis
- Handles React and dynamic content
- Comprehensive error detection and logging
- Graceful stopping on errors or dead ends
- Easy configuration via `config.json`
- Structured output for LLM consumption

## Setup

1. Install dependencies:

```bash
npm install puppeteer
```

2. Configure your target website and login details in `config.json`.

3. Run the program:

```bash
node index.js
```

## MCP Server Integration

Currently, MCP server setup is a stub. You can extend the `setupMCPServer` function in `index.js` to install and launch your preferred MCP or proxy server automatically.

## Notes

- Ensure your selectors in `config.json` match the login form elements of your target website.
- The program runs headless by default; you can change this in `index.js` for debugging.

## Future Improvements

- Full MCP server automatic installation and configuration
- Advanced error and usability analysis
- Integration with LLM for automated repair suggestions
