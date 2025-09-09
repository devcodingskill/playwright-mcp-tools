#!/usr/bin/env node

import { Command } from 'commander';
import PlaywrightMCPServer from './server.js';

const program = new Command();

program
  .name('mcp-playwright')
  .description('MCP Playwright Server - Playwright automation via Model Context Protocol')
  .version('1.0.0');

program
  .command('serve')
  .description('Start the MCP server')
  .action(async () => {
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
      console.error('Starting MCP Playwright server...');
      await server.run();
    } catch (error) {
      console.error('Server error:', error);
      await server.cleanup();
      process.exit(1);
    }
  });

program.parse();

// If no command is provided, default to serve
if (!process.argv.slice(2).length) {
  program.parse(['node', 'mcp-playwright', 'serve']);
}
