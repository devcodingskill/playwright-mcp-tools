#!/usr/bin/env node

import PlaywrightMCPServer from './server.js';

async function main() {
  const server = new PlaywrightMCPServer();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('Received SIGINT, shutting down gracefully...');
    await server.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('Received SIGTERM, shutting down gracefully...');
    await server.cleanup();
    process.exit(0);
  });

  try {
    await server.run();
  } catch (error) {
    console.error('Server error:', error);
    await server.cleanup();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
