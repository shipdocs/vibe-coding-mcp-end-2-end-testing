const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../reports/logs/mcp-server.log') 
    })
  ]
});

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../reports/logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Config loading
let config;
try {
  const configPath = path.join(__dirname, '../../config.json');
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    config = { mcpServerConfig: { port: 8080 } };
    logger.warn('Config file not found, using default port 8080');
  }
} catch (error) {
  logger.error('Error loading config:', error);
  config = { mcpServerConfig: { port: 8080 } };
}

const port = config.mcpServerConfig?.port || 8080;

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Resource registry
const resources = {};

// Register a resource
function registerResource(id, data) {
  resources[id] = data;
  logger.info(`Resource registered: ${id}`);
  return id;
}

// MCP resource endpoint
app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  
  if (resources[id]) {
    logger.info(`Resource accessed: ${id}`);
    res.json(resources[id]);
  } else {
    logger.warn(`Resource not found: ${id}`);
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Resource listing
app.get('/resources', (req, res) => {
  res.json(Object.keys(resources).map(id => ({ id })));
});

// MCP command endpoint
app.post('/commands/:name', async (req, res) => {
  const { name } = req.params;
  const { args } = req.body || {};
  
  logger.info(`Command received: ${name}`, { args });
  
  try {
    switch (name) {
      case 'startTest':
        // Resource to track test status
        const testId = registerResource('test-status', { 
          status: 'running', 
          startTime: new Date().toISOString() 
        });
        
        // Emit event to trigger test (in actual implementation, this would communicate with the test runner)
        process.emit('mcp:startTest', args);
        
        res.json({ success: true, testId });
        break;
      
      case 'getStatus':
        res.json({ 
          status: 'running', 
          resources: Object.keys(resources)
        });
        break;
        
      default:
        logger.warn(`Unknown command: ${name}`);
        res.status(400).json({ error: `Unknown command: ${name}` });
    }
  } catch (error) {
    logger.error(`Command error: ${name}`, error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
let server;
function startServer() {
  server = app.listen(port, () => {
    logger.info(`MCP server started on port ${port}`);
    console.log(`MCP server started on port ${port}`);
  });

  // Handle shutdown
  process.on('SIGINT', () => {
    logger.info('Shutting down MCP server');
    server.close();
    process.exit(0);
  });
}

// Initialize the server if this module is run directly
if (require.main === module) {
  startServer();
}

// Export for use in other modules
module.exports = {
  app,
  startServer,
  registerResource
};