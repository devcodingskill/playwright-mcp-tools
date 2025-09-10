# MCP Playwright

A Model Context Protocol (MCP) server that provides Playwright browser automation capabilities. This package allows AI assistants and other MCP clients to control web browsers, interact with web pages, and perform automated testing tasks.

## Features

- 🌐 Support for multiple browsers (Chromium, Firefox, WebKit)
- 🔄 Multiple browser session management
- 📸 Screenshot capture
- 🖱️ Element interaction (click, fill, etc.)
- ⏱️ Wait for elements and conditions
- 📜 JavaScript execution
- 📄 Page content extraction
- 🎯 CSS selector and text-based element targeting

## Installation

```bash
npm install -g mcp-playwright
```

Or for local development:

```bash
npm install mcp-playwright
```

## Usage

### As a Standalone Server

```bash
mcp-playwright serve
```

### With MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "mcp-playwright",
      "args": ["serve"]
    }
  }
}
```

### Programmatic Usage

```typescript
import PlaywrightMCPServer from 'mcp-playwright';

const server = new PlaywrightMCPServer();
await server.run();
```

## Available Tools

### `launch_browser`
Launch a new browser instance.

**Parameters:**
- `browserType` (optional): "chromium", "firefox", or "webkit" (default: "chromium")
- `headless` (optional): Run in headless mode (default: true)
- `sessionId` (optional): Unique session identifier (default: "default")

### `navigate_to`
Navigate to a specific URL.

**Parameters:**
- `url` (required): URL to navigate to
- `sessionId` (optional): Browser session ID (default: "default")

### `click_element`
Click on an element using CSS selector or text.

**Parameters:**
- `selector` (required): CSS selector or text content to click
- `sessionId` (optional): Browser session ID (default: "default")

### `fill_input`
Fill an input field with text.

**Parameters:**
- `selector` (required): CSS selector for the input field
- `text` (required): Text to fill in the input
- `sessionId` (optional): Browser session ID (default: "default")

### `get_text`
Get text content from an element.

**Parameters:**
- `selector` (required): CSS selector for the element
- `sessionId` (optional): Browser session ID (default: "default")

### `take_screenshot`
Take a screenshot of the current page.

**Parameters:**
- `path` (optional): Path to save the screenshot (default: "screenshot.png")
- `fullPage` (optional): Capture full page (default: false)
- `sessionId` (optional): Browser session ID (default: "default")

### `wait_for_element`
Wait for an element to appear on the page.

**Parameters:**
- `selector` (required): CSS selector to wait for
- `timeout` (optional): Timeout in milliseconds (default: 30000)
- `sessionId` (optional): Browser session ID (default: "default")

### `execute_script`
Execute JavaScript code in the browser context.

**Parameters:**
- `script` (required): JavaScript code to execute
- `sessionId` (optional): Browser session ID (default: "default")

### `get_page_source`
Get the HTML source of the current page.

**Parameters:**
- `sessionId` (optional): Browser session ID (default: "default")

### `close_browser`
Close a browser session.

**Parameters:**
- `sessionId` (optional): Browser session ID to close (default: "default")

## Examples

### Basic Web Automation

1. Launch a browser:
```json
{
  "tool": "launch_browser",
  "arguments": {
    "browserType": "chromium",
    "headless": false,
    "sessionId": "my-session"
  }
}
```

2. Navigate to a website:
```json
{
  "tool": "navigate_to",
  "arguments": {
    "url": "https://example.com",
    "sessionId": "my-session"
  }
}
```

3. Interact with elements:
```json
{
  "tool": "click_element",
  "arguments": {
    "selector": "button[type='submit']",
    "sessionId": "my-session"
  }
}
```

### Web Scraping

1. Extract text content:
```json
{
  "tool": "get_text",
  "arguments": {
    "selector": "h1.title",
    "sessionId": "my-session"
  }
}
```

2. Take screenshots:
```json
{
  "tool": "take_screenshot",
  "arguments": {
    "path": "./screenshots/page.png",
    "fullPage": true,
    "sessionId": "my-session"
  }
}
```

### Advanced Automation

1. Execute custom JavaScript:
```json
{
  "tool": "execute_script",
  "arguments": {
    "script": "return document.querySelectorAll('a').length;",
    "sessionId": "my-session"
  }
}
```

2. Wait for dynamic content:
```json
{
  "tool": "wait_for_element",
  "arguments": {
    "selector": ".dynamic-content",
    "timeout": 10000,
    "sessionId": "my-session"
  }
}
```

## Multiple Browser Sessions

You can manage multiple browser sessions simultaneously by using different `sessionId` values:

```json
// Launch first browser
{
  "tool": "launch_browser",
  "arguments": {
    "sessionId": "browser-1",
    "browserType": "chromium"
  }
}

// Launch second browser
{
  "tool": "launch_browser",
  "arguments": {
    "sessionId": "browser-2",
    "browserType": "firefox"
  }
}
```

## Requirements

- Node.js 18+
- The package automatically installs Playwright browsers on first use

## Development

1. Clone the repository:
```bash
git clone https://github.com/devcodingskill/mcp-playwright.git
cd mcp-playwright
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run in development mode:
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Browser Installation Issues
If you encounter browser installation issues, try:
```bash
npx playwright install
```

### Permission Issues
On Linux/macOS, you might need to install additional dependencies:
```bash
npx playwright install-deps
```

### Memory Issues
For large-scale automation, consider:
- Using headless mode
- Closing browser sessions when done
- Managing multiple sessions carefully

## Security Considerations

- This tool provides powerful browser automation capabilities
- Be cautious when executing untrusted JavaScript code
- Consider running in isolated environments for production use
- Review and sanitize any user-provided selectors or scripts
