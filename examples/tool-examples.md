# Example MCP Tool Calls for Playwright

## Basic Web Automation Workflow

### 1. Launch Browser
```json
{
  "tool": "launch_browser",
  "arguments": {
    "browserType": "chromium",
    "headless": false,
    "sessionId": "automation-session"
  }
}
```

### 2. Navigate to Website
```json
{
  "tool": "navigate_to",
  "arguments": {
    "url": "https://example.com",
    "sessionId": "automation-session"
  }
}
```

### 3. Fill Form Fields
```json
{
  "tool": "fill_input",
  "arguments": {
    "selector": "#username",
    "text": "user@example.com",
    "sessionId": "automation-session"
  }
}
```

```json
{
  "tool": "fill_input",
  "arguments": {
    "selector": "#password",
    "text": "secretpassword",
    "sessionId": "automation-session"
  }
}
```

### 4. Click Submit Button
```json
{
  "tool": "click_element",
  "arguments": {
    "selector": "button[type='submit']",
    "sessionId": "automation-session"
  }
}
```

### 5. Wait for Page Load
```json
{
  "tool": "wait_for_element",
  "arguments": {
    "selector": ".dashboard",
    "timeout": 10000,
    "sessionId": "automation-session"
  }
}
```

### 6. Take Screenshot
```json
{
  "tool": "take_screenshot",
  "arguments": {
    "path": "./screenshots/dashboard.png",
    "fullPage": true,
    "sessionId": "automation-session"
  }
}
```

### 7. Extract Data
```json
{
  "tool": "get_text",
  "arguments": {
    "selector": ".user-name",
    "sessionId": "automation-session"
  }
}
```

### 8. Close Browser
```json
{
  "tool": "close_browser",
  "arguments": {
    "sessionId": "automation-session"
  }
}
```

## Advanced Examples

### Web Scraping with JavaScript Execution
```json
{
  "tool": "execute_script",
  "arguments": {
    "script": "return Array.from(document.querySelectorAll('h2')).map(h => h.textContent);",
    "sessionId": "scraping-session"
  }
}
```

### Multiple Browser Sessions
```json
{
  "tool": "launch_browser",
  "arguments": {
    "browserType": "chromium",
    "sessionId": "session-1"
  }
}
```

```json
{
  "tool": "launch_browser",
  "arguments": {
    "browserType": "firefox",
    "sessionId": "session-2"
  }
}
```

### Dynamic Content Handling
```json
{
  "tool": "wait_for_element",
  "arguments": {
    "selector": "[data-testid='dynamic-content']",
    "timeout": 15000,
    "sessionId": "test-session"
  }
}
```

### Page Source Extraction
```json
{
  "tool": "get_page_source",
  "arguments": {
    "sessionId": "scraping-session"
  }
}
```
