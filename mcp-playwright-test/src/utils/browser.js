const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');

// Screenshot directory
const screenshotDir = path.join(__dirname, '../../reports/screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Video directory
const videoDir = path.join(__dirname, '../../reports/videos');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}

class BrowserManager {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.isRecording = false;
  }
  
  async launch(options = {}) {
    const headless = options.headless !== false;
    
    this.browser = await chromium.launch({ 
      headless
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: options.recordVideo !== false ? { 
        dir: videoDir,
        size: { width: 1280, height: 720 } 
      } : undefined
    });
    
    if (options.recordVideo !== false) {
      this.isRecording = true;
    }
    
    this.page = await this.context.newPage();
    
    // Setup error handling
    this.page.on('pageerror', error => {
      console.error('Page error:', error);
    });
    
    this.page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });
    
    return this.page;
  }
  
  async screenshot(name) {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);
    
    await this.page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  }
  
  async getAccessibilityReport() {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    
    const snapshot = await this.page.accessibility.snapshot();
    return snapshot;
  }
  
  async getPerformanceMetrics() {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    
    // Only works for Chromium
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Performance.enable');
    const metrics = await client.send('Performance.getMetrics');
    
    return metrics.metrics;
  }
  
  async close() {
    if (this.browser) {
      if (this.isRecording) {
        // Wait to ensure video is saved
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
      this.isRecording = false;
    }
  }
}

module.exports = BrowserManager;