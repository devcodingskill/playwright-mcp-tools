// Simple test to verify the server works
// This simulates what an MCP client would do

import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { spawn } from 'child_process';

async function testMCPServer() {
  console.log('🧪 Testing MCP Playwright Server...');
  
  // Start the server process
  const serverProcess = spawn('node', ['dist/cli.js', 'serve'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Create client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/cli.js', 'serve']
  });
  
  const client = new Client({
    name: 'test-client',
    version: '1.0.0'
  }, {
    capabilities: {}
  });
  
  try {
    await client.connect(transport);
    console.log('✅ Connected to MCP server');
    
    // List available tools
    const tools = await client.listTools();
    console.log('🔧 Available tools:', tools.tools.map(t => t.name));
    
    // Test a simple tool call (this would normally be done by the AI)
    const result = await client.callTool('launch_browser', {
      browserType: 'chromium',
      headless: true,
      sessionId: 'test-session'
    });
    
    console.log('🎭 Browser launch result:', result);
    
    // Cleanup
    await client.callTool('close_browser', {
      sessionId: 'test-session'
    });
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    serverProcess.kill();
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testMCPServer();
}
