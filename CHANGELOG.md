# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- Initial release of MCP Playwright
- Model Context Protocol server for Playwright automation
- Support for multiple browsers (Chromium, Firefox, WebKit)
- Browser session management with unique session IDs
- Core automation tools:
  - `launch_browser` - Launch browser instances
  - `navigate_to` - Navigate to URLs
  - `click_element` - Click on elements
  - `fill_input` - Fill form inputs
  - `get_text` - Extract text content
  - `take_screenshot` - Capture screenshots
  - `wait_for_element` - Wait for elements to appear
  - `execute_script` - Run JavaScript in browser context
  - `get_page_source` - Get page HTML source
  - `close_browser` - Close browser sessions
- CLI interface with command-line options
- TypeScript support with full type definitions
- Comprehensive documentation and examples
- Jest testing framework setup
- ESLint configuration for code quality
- Automatic Playwright browser installation on setup

### Features
- Headless and non-headless browser modes
- Full page and element-specific screenshots
- CSS selector and text-based element targeting
- Customizable timeouts for element waiting
- JavaScript execution with return value capture
- Multiple concurrent browser session support
- Graceful shutdown and cleanup handling
- Cross-platform compatibility (Windows, macOS, Linux)

### Developer Experience
- Complete TypeScript support
- Auto-generated type definitions
- Comprehensive examples and documentation
- Easy integration with MCP clients
- CLI tool for standalone usage
- Development scripts for watch mode and testing
