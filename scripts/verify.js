#!/usr/bin/env node

// Quick verification that the package builds and basic functionality works
import PlaywrightMCPServer from '../dist/server.js';

async function verify() {
  console.log('🧪 Verifying MCP Playwright package...');
  
  try {
    // Test server creation
    console.log('✓ Creating server instance...');
    const server = new PlaywrightMCPServer();
    
    // Test cleanup (should not throw)
    console.log('✓ Testing cleanup...');
    await server.cleanup();
    
    console.log('✅ All verification checks passed!');
    console.log('');
    console.log('📦 Package is ready for distribution');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Test with: mcp-playwright serve');
    console.log('  2. Configure your MCP client');
    console.log('  3. Publish with: npm publish');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();
