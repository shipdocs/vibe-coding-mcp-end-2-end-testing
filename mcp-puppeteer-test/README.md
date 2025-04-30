# MCP Puppeteer Test

This project is a Node.js program designed to automatically set up an MCP server (or proxy server) and run Puppeteer-based browser automation tests on a target website. It supports dynamic websites including React apps, performs error detection, usability checks, and logs detailed notes for further analysis and repair using an LLM.

## Features

- Automatic MCP server setup (stub implementation, extendable)
- Puppeteer automation for login, navigation, and analysis
- Handles React and dynamic content
- Comprehensive error detection and logging
- Graceful stopping on errors or dead ends
- Easy configuration via `config.json` or interactive prompt on first run
- Structured output for LLM consumption

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

- The program will automatically set up the MCP server (stub) and launch Puppeteer to perform login and testing.
- Errors and usability issues will be logged in the console.
- Screenshots and logs can be extended as needed.

## MCP Server Integration

Currently, MCP server setup is a stub. You can extend the `setupMCPServer` function in `index.js` to install and launch your preferred MCP or proxy server automatically.

## Troubleshooting

- If Puppeteer fails to launch, ensure the `--no-sandbox` and `--disable-setuid-sandbox` flags are used (already included).
- Verify that the selectors you provide match the actual elements on your target website.

## Future Improvements

- Full MCP server automatic installation and configuration
- Advanced error and usability analysis
- Integration with LLM for automated repair suggestions

## Contributing

Feel free to fork and submit pull requests for improvements.

## License

MIT License
