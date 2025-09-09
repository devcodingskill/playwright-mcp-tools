// Example usage of MCP Playwright as a library
import PlaywrightMCPServer from 'mcp-playwright';

async function example() {
  const server = new PlaywrightMCPServer();
  
  // This would typically be handled by an MCP client
  // This is just to show the structure
  
  try {
    console.log('Starting MCP Playwright server...');
    
    // In a real scenario, you would connect this to an MCP transport
    // await server.run();
    
    console.log('Server started successfully!');
  } catch (error) {
    console.error('Error starting server:', error);
  } finally {
    await server.cleanup();
  }
}

example();
