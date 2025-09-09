#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎭 Setting up MCP Playwright...');

// Install Playwright browsers
console.log('📦 Installing Playwright browsers...');
try {
  execSync('npx playwright install', { stdio: 'inherit' });
  console.log('✅ Playwright browsers installed successfully!');
} catch (error) {
  console.error('❌ Failed to install Playwright browsers:', error.message);
  console.log('💡 You can install them manually later with: npx playwright install');
}

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('📁 Created screenshots directory');
}

console.log('🎉 MCP Playwright setup complete!');
console.log('');
console.log('Quick start:');
console.log('  1. Run: mcp-playwright serve');
console.log('  2. Add to your MCP client configuration');
console.log('  3. Start automating!');
console.log('');
console.log('For more information, see README.md');
