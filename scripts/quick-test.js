#!/usr/bin/env node

// Quick test to verify the MCP server responds correctly
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function quickTest() {
  console.log('🧪 Quick Test: Starting MCP Playwright Server...');
  
  // Start the server
  const server = spawn('node', ['dist/cli.js', 'serve'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let output = '';
  server.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  server.stderr.on('data', (data) => {
    output += data.toString();
  });
  
  // Wait a moment for server to start
  await setTimeout(2000);
  
  if (output.includes('Starting MCP Playwright server')) {
    console.log('✅ Server started successfully!');
    console.log('📤 Server output:', output.trim());
  } else {
    console.log('❌ Server may not have started correctly');
    console.log('📤 Output:', output);
  }
  
  // Test that we can send a simple JSON-RPC message
  const testMessage = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  }) + '\n';
  
  server.stdin.write(testMessage);
  
  // Wait for response
  await setTimeout(1000);
  
  // Cleanup
  server.kill('SIGTERM');
  
  console.log('');
  console.log('🎯 How to use:');
  console.log('1. Copy the config to Claude Desktop');
  console.log('2. Restart Claude Desktop');
  console.log('3. Ask Claude to "launch a browser and go to google.com"');
  console.log('4. Claude will use these Playwright tools automatically!');
}

quickTest().catch(console.error);
