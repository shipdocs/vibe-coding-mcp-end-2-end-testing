const BrowserManager = require('../utils/browser');
const { registerResource } = require('../mcp/server');
const fs = require('fs');
const path = require('path');

class LoginModule {
  constructor(config) {
    this.config = config;
    this.browserManager = new BrowserManager(config);
  }
  
  async login(options = {}) {
    const page = await this.browserManager.launch({
      headless: options.headless !== false,
      recordVideo: options.recordVideo !== false
    });
    
    try {
      // Register the start of login process
      registerResource('login-process', { 
        status: 'started',
        timestamp: new Date().toISOString(),
        loginUrl: this.config.loginUrl
      });
      
      // Navigate to login page
      console.log('Navigating to login page...');
      await page.goto(this.config.loginUrl, { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });
      
      // Take screenshot of login page
      const loginScreenshot = await this.browserManager.screenshot('login-page');
      registerResource('login-screenshot', { 
        path: loginScreenshot,
        url: page.url()
      });
      
      // Check if login form elements exist
      const formCheck = await this.checkLoginForm(page);
      if (!formCheck.success) {
        throw new Error(`Login form issue: ${formCheck.error}`);
      }
      
      // Fill login form
      await page.fill(this.config.loginSelector.username, this.config.credentials.username);
      await page.fill(this.config.loginSelector.password, this.config.credentials.password);
      
      // Take screenshot before submitting
      await this.browserManager.screenshot('before-submit');
      
      // Submit form
      console.log('Submitting login form...');
      try {
        await Promise.all([
          page.click(this.config.loginSelector.submit),
          page.waitForNavigation({ 
            waitUntil: 'networkidle',
            timeout: 60000 
          })
        ]);
      } catch (error) {
        // Sometimes the form submission doesn't trigger navigation
        console.log('Navigation after login failed, continuing anyway:', error.message);
      }
      
      // Take screenshot after login
      const afterLoginScreenshot = await this.browserManager.screenshot('after-login');
      registerResource('after-login-screenshot', { 
        path: afterLoginScreenshot,
        url: page.url()
      });
      
      // Check if login was successful
      const loginCheckResult = await this.checkLoginSuccess(page);
      
      if (loginCheckResult.success) {
        console.log('Login successful');
        registerResource('login-status', { 
          success: true, 
          url: page.url(),
          timestamp: new Date().toISOString() 
        });
      } else {
        console.log('Login failed:', loginCheckResult.reason);
        registerResource('login-status', { 
          success: false, 
          url: page.url(),
          reason: loginCheckResult.reason,
          timestamp: new Date().toISOString()
        });
      }
      
      return { 
        success: loginCheckResult.success, 
        page,
        reason: loginCheckResult.reason 
      };
    } catch (error) {
      console.error('Login error:', error);
      // Take screenshot of error state
      const errorScreenshot = await this.browserManager.screenshot('login-error');
      
      registerResource('login-error', { 
        message: error.message, 
        stack: error.stack,
        screenshot: errorScreenshot,
        url: page.url()
      });
      
      return { 
        success: false, 
        error: error.message,
        page
      };
    }
  }
  
  async checkLoginForm(page) {
    try {
      // Check if username field exists
      const usernameField = await page.$(this.config.loginSelector.username);
      if (!usernameField) {
        return { success: false, error: `Username field not found: ${this.config.loginSelector.username}` };
      }
      
      // Check if password field exists
      const passwordField = await page.$(this.config.loginSelector.password);
      if (!passwordField) {
        return { success: false, error: `Password field not found: ${this.config.loginSelector.password}` };
      }
      
      // Check if submit button exists
      const submitButton = await page.$(this.config.loginSelector.submit);
      if (!submitButton) {
        return { success: false, error: `Submit button not found: ${this.config.loginSelector.submit}` };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async checkLoginSuccess(page) {
    // Method 1: Check if we're redirected away from login page
    const currentUrl = page.url();
    if (!currentUrl.includes(new URL(this.config.loginUrl).pathname)) {
      return { success: true };
    }
    
    // Method 2: Check for error messages (common login error selectors)
    const errorSelectors = [
      '.error-message', 
      '.alert-danger', 
      '#error-message',
      '[role="alert"]',
      '.login-error'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = await page.$(selector);
      if (errorElement) {
        const errorText = await errorElement.textContent();
        return { success: false, reason: `Error message found: ${errorText}` };
      }
    }
    
    // Method 3: Check for presence of expected elements after login
    if (this.config.successSelector) {
      const successElement = await page.$(this.config.successSelector);
      if (successElement) {
        return { success: true };
      }
      return { success: false, reason: 'Success element not found after login' };
    }
    
    // If we have a target URL, and we're not there, assume failed
    if (this.config.targetUrl && !currentUrl.includes(this.config.targetUrl)) {
      return { success: false, reason: `Not redirected to target URL: ${this.config.targetUrl}` };
    }
    
    // If we can't determine success/failure, assume success if we navigated away from login page
    return { success: true, reason: 'Navigated away from login page' };
  }
  
  async navigateToTarget() {
    if (!this.browserManager.page) {
      throw new Error('Browser not launched. Call login() first.');
    }
    
    if (!this.config.targetUrl) {
      console.log('No target URL specified, skipping navigation');
      return;
    }
    
    try {
      console.log(`Navigating to target URL: ${this.config.targetUrl}`);
      await this.browserManager.page.goto(this.config.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: a60000 
      });
      
      // Take screenshot of target page
      const targetScreenshot = await this.browserManager.screenshot('target-page');
      registerResource('target-screenshot', { 
        path: targetScreenshot,
        url: this.browserManager.page.url()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Navigation error:', error);
      const errorScreenshot = await this.browserManager.screenshot('navigation-error');
      
      registerResource('navigation-error', { 
        message: error.message, 
        stack: error.stack,
        screenshot: errorScreenshot,
        url: this.browserManager.page.url()
      });
      
      return { success: false, error: error.message };
    }
  }
  
  async close() {
    await this.browserManager.close();
  }
}

module.exports = LoginModule;