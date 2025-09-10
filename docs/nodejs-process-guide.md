# Node.js Process Object - Complete Guide

## 🌐 What is the Process Object?

The `process` object is a **global object** in Node.js that provides information about and control over the current Node.js process. It's available everywhere in your Node.js application without needing to import it.

### Key Points:
- ✅ **Built into Node.js** - No import required
- ✅ **Global object** - Available in all files
- ❌ **Server-side only** - Not available in browsers
- 🎯 **Essential for production apps** - Process management and monitoring

---

## 🔧 Core Process Methods

### 1. Process Events - `process.on()`

Listen for system signals and events:

```javascript
// Listen for Ctrl+C (graceful shutdown)
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  // Cleanup code here
  process.exit(0);
});

// Listen for termination signal
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down...');
  // Cleanup code here
  process.exit(0);
});

// Listen for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Listen for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
```

### 2. Process Exit - `process.exit()`

Terminate the Node.js process:

```javascript
process.exit(0);    // ✅ Success exit
process.exit(1);    // ❌ Error exit
process.exit(130);  // 🛑 Terminated by SIGINT
```

**Exit Codes:**
- `0` - Success
- `1` - General errors
- `2` - Misuse of shell commands
- `130` - Script terminated by Ctrl+C

---

## 📊 Process Information

### Environment Variables - `process.env`

```javascript
// Common environment variables
console.log(process.env.NODE_ENV);        // 'development' | 'production'
console.log(process.env.PORT);            // Server port
console.log(process.env.HOME);            // User home directory
console.log(process.env.PATH);            // System PATH

// Custom environment variables
process.env.MY_API_KEY = 'secret123';     // Set variable
console.log(process.env.MY_API_KEY);      // Read variable

// Check environment
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
}
```

### Command Line Arguments - `process.argv`

```javascript
// Example: node script.js --port 3000 --verbose
console.log(process.argv);
// Output: ['node', '/path/to/script.js', '--port', '3000', '--verbose']

// Get arguments (skip first 2)
const args = process.argv.slice(2);
console.log('Arguments:', args); // ['--port', '3000', '--verbose']

// Parse arguments
const port = process.argv.includes('--port') 
  ? process.argv[process.argv.indexOf('--port') + 1] 
  : 3000;
```

### System Information

```javascript
// Platform information
console.log(process.platform);           // 'win32', 'darwin', 'linux'
console.log(process.arch);               // 'x64', 'arm64'
console.log(process.version);            // Node.js version
console.log(process.versions);           // All versions (node, v8, etc.)

// Process information
console.log(process.pid);                // Process ID
console.log(process.ppid);               // Parent process ID
console.log(process.cwd());              // Current working directory
console.log(process.uptime());           // Process uptime in seconds

// Memory usage
console.log(process.memoryUsage());
// Output: { rss: 123456, heapTotal: 789012, heapUsed: 345678, external: 12345 }
```

---

## 🎯 Common Use Cases

### 1. Graceful Server Shutdown

```javascript
const express = require('express');
const app = express();
const server = app.listen(3000);

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close database connections, cleanup resources
    // database.close();
    
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
```

### 2. Environment-Based Configuration

```javascript
const config = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'myapp'
  },
  logging: process.env.NODE_ENV === 'development',
  cors: process.env.NODE_ENV !== 'production'
};

console.log('Starting with config:', config);
```

### 3. Process Monitoring

```javascript
// Monitor memory usage
setInterval(() => {
  const memory = process.memoryUsage();
  console.log({
    rss: Math.round(memory.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
    uptime: Math.round(process.uptime()) + ' seconds'
  });
}, 30000); // Every 30 seconds

// CPU usage tracking
const startUsage = process.cpuUsage();
setTimeout(() => {
  const endUsage = process.cpuUsage(startUsage);
  console.log('CPU Usage:', endUsage);
}, 1000);
```

### 4. Command Line Tool

```javascript
#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: mytool [options]
Options:
  --help, -h     Show help
  --version, -v  Show version
  --port <port>  Set port number
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('v1.0.0');
  process.exit(0);
}

const portIndex = args.indexOf('--port');
const port = portIndex !== -1 ? args[portIndex + 1] : 3000;

console.log(`Starting server on port ${port}`);
```

---

## 🚨 Process Signals Reference

| Signal | Description | Default Action | Can Catch? |
|--------|-------------|---------------|------------|
| `SIGINT` | Interrupt (Ctrl+C) | Terminate | ✅ Yes |
| `SIGTERM` | Termination request | Terminate | ✅ Yes |
| `SIGKILL` | Force kill | Terminate | ❌ No |
| `SIGQUIT` | Quit (Ctrl+\\) | Core dump | ✅ Yes |
| `SIGHUP` | Hangup | Terminate | ✅ Yes |
| `SIGUSR1` | User signal 1 | Terminate | ✅ Yes |
| `SIGUSR2` | User signal 2 | Terminate | ✅ Yes |

### Signal Handling Example:

```javascript
process.on('SIGINT', () => {
  console.log('👋 Goodbye! (Ctrl+C)');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🔄 Terminating gracefully...');
  process.exit(0);
});

process.on('SIGUSR1', () => {
  console.log('📊 Printing debug info...');
  console.log('Memory:', process.memoryUsage());
  console.log('Uptime:', process.uptime());
});

// Send signal to process: kill -USR1 <pid>
```

---

## ⚡ Advanced Process Methods

### Process Timing

```javascript
// High-resolution time
const start = process.hrtime.bigint();
// ... some operation ...
const end = process.hrtime.bigint();
console.log(`Operation took ${end - start} nanoseconds`);

// Schedule callback for next tick
process.nextTick(() => {
  console.log('This runs before any timers');
});

setTimeout(() => {
  console.log('This runs after nextTick');
}, 0);
```

### Working Directory

```javascript
// Get current working directory
console.log('Current directory:', process.cwd());

// Change working directory
try {
  process.chdir('/path/to/new/directory');
  console.log('Changed to:', process.cwd());
} catch (err) {
  console.error('Failed to change directory:', err);
}
```

### Process Streams

```javascript
// Standard input/output
process.stdout.write('Hello ');
process.stdout.write('World!\n');

process.stderr.write('This is an error message\n');

// Read from stdin
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`You typed: ${chunk}`);
  }
});
```

---

## 🛡️ Error Handling Best Practices

### 1. Comprehensive Error Handling

```javascript
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  
  // Log to file or external service
  // logger.fatal('Uncaught exception', error);
  
  // Graceful shutdown
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Log to file or external service
  // logger.fatal('Unhandled rejection', { reason, promise });
  
  // Graceful shutdown
  process.exit(1);
});

// Handle warnings
process.on('warning', (warning) => {
  console.warn('Warning:', warning.name, warning.message);
});
```

### 2. Production-Ready Process Management

```javascript
class ProcessManager {
  constructor() {
    this.isShuttingDown = false;
    this.setupSignalHandlers();
  }

  setupSignalHandlers() {
    // Graceful shutdown signals
    ['SIGTERM', 'SIGINT'].forEach(signal => {
      process.on(signal, () => this.gracefulShutdown(signal));
    });

    // Error handling
    process.on('uncaughtException', this.handleError.bind(this));
    process.on('unhandledRejection', this.handleError.bind(this));
  }

  async gracefulShutdown(signal) {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    try {
      // Close servers
      await this.closeServers();
      
      // Close database connections
      await this.closeDatabases();
      
      // Cleanup resources
      await this.cleanup();
      
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  handleError(error) {
    console.error('Fatal error:', error);
    
    if (!this.isShuttingDown) {
      this.gracefulShutdown('ERROR');
    }
  }

  async closeServers() {
    // Close HTTP servers, WebSocket connections, etc.
  }

  async closeDatabases() {
    // Close database connections
  }

  async cleanup() {
    // Cleanup temporary files, release resources, etc.
  }
}

// Usage
const processManager = new ProcessManager();
```

---

## 📚 Quick Reference

### Most Common Process Properties/Methods:

```javascript
// Environment & Arguments
process.env.NODE_ENV          // Environment variables
process.argv                  // Command line arguments
process.cwd()                 // Current working directory

// Process Information
process.pid                   // Process ID
process.platform              // Operating system
process.version               // Node.js version
process.uptime()              // Process uptime

// Process Control
process.exit(code)            // Exit with code
process.on(event, callback)   // Listen for events
process.nextTick(callback)    // Schedule callback

// Memory & Performance
process.memoryUsage()         // Memory usage stats
process.cpuUsage()            // CPU usage stats
process.hrtime()              // High-resolution time
```

### Common Environment Variables:

```javascript
NODE_ENV=production           // Environment mode
PORT=3000                     // Server port
DEBUG=*                       // Debug logging
HOME=/Users/username          // User home directory
PATH=/usr/bin:/bin            // System PATH
```

---

## 🎯 Tips & Best Practices

1. **Always handle SIGINT and SIGTERM** for graceful shutdowns
2. **Use environment variables** for configuration
3. **Set up error handlers** for uncaught exceptions
4. **Monitor memory usage** in production
5. **Use process.nextTick()** sparingly (can starve I/O)
6. **Log process events** for debugging
7. **Test signal handling** in your applications
8. **Use process managers** like PM2 in production

---

*This document covers the essential aspects of the Node.js process object. For more advanced usage, refer to the official Node.js documentation.*
