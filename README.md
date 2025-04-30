# MCP Puppeteer Test with Roo-Code and Augment Integration

This project is a Node.js program designed to automatically set up an MCP server and run Puppeteer-based browser automation tests on a target website. It supports dynamic websites including React apps, performs error detection, usability checks, and logs detailed notes for further analysis and repair using LLMs. The program integrates with VSCode AI extensions like Roo-Code and Augment via the Model Context Protocol (MCP).

## Features

- MCP server implementation exposing resources and accepting commands via MCP protocol
- Puppeteer automation for login, navigation, autonomous exploration, and analysis
- Handles React and dynamic content
- Comprehensive error detection and logging
- Bidirectional communication with Roo-Code and Augment for AI-guided testing
- Easy configuration via `config.json` or interactive prompt on first run
- Structured output for LLM consumption and AI extension integration

## Setup

1. Clone the repository:

```bash
git clone https://github.com/shipdocs/vibe-coding-mcp-end-2-end-testing.git
cd vibe-coding-mcp-end-2-end-testing/mcp-puppeteer-test
```

2. Install dependencies:

```bash
npm install
```

3. Run the program:

```bash
node index.js
```

- On first run, if `config.json` is not found, the program will prompt you to enter the login URL, credentials, selectors, target URL, and MCP server port.
- The configuration will be saved to `config.json` for future runs.

## Usage

- The program starts an MCP server that listens for commands from AI extensions like Roo-Code and Augment.
- Use the AI extensions to send commands (e.g., `startTest`) to initiate testing.
- The program performs login and autonomous exploration/testing of the website.
- Logs, test results, screenshots, and other data are exposed as MCP resources accessible by the AI extensions.
- AI extensions can analyze this data and provide guidance or automated repair suggestions.

## MCP Server Integration

- The MCP server is implemented in `mcp-server.js` and integrated in `index.js`.
- It exposes HTTP endpoints for resources and commands following MCP protocol conventions.
- Compatible with Roo-Code and Augment MCP features such as `access_mcp_resource`.

## Troubleshooting

- Puppeteer runs with `--no-sandbox` and `--disable-setuid-sandbox` flags for compatibility.
- Ensure selectors provided during configuration match the target website elements.
- Verify MCP server port availability.

## Future Improvements

- Implement AI-guided autonomous exploration and testing heuristics.
- Enhance MCP protocol support for richer interaction with AI extensions.
- Add more detailed logging and error analysis.
- Provide example workflows for Roo-Code and Augment integration.

## Contributing

Feel free to fork and submit pull requests for improvements.

## License

MIT License
