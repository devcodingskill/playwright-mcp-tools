import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium, firefox, webkit, Browser, Page, BrowserContext } from 'playwright';

interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  type: 'chromium' | 'firefox' | 'webkit';
}

class PlaywrightMCPServer {
  private server: Server;
  private activeSessions: Map<string, BrowserSession> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-playwright',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'launch_browser',
            description: 'Launch a new browser instance (chromium, firefox, or webkit)',
            inputSchema: {
              type: 'object',
              properties: {
                browserType: {
                  type: 'string',
                  enum: ['chromium', 'firefox', 'webkit'],
                  description: 'Type of browser to launch',
                  default: 'chromium'
                },
                headless: {
                  type: 'boolean',
                  description: 'Run browser in headless mode',
                  default: true
                },
                sessionId: {
                  type: 'string',
                  description: 'Unique identifier for this browser session',
                  default: 'default'
                }
              },
              required: []
            }
          },
          {
            name: 'navigate_to',
            description: 'Navigate to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to navigate to'
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['url']
            }
          },
          {
            name: 'click_element',
            description: 'Click on an element using CSS selector or text',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector or text content to click'
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'fill_input',
            description: 'Fill an input field with text',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input field'
                },
                text: {
                  type: 'string',
                  description: 'Text to fill in the input'
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['selector', 'text']
            }
          },
          {
            name: 'get_text',
            description: 'Get text content from an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element'
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot',
                  default: 'screenshot.png'
                },
                fullPage: {
                  type: 'boolean',
                  description: 'Capture full page',
                  default: false
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: []
            }
          },
          {
            name: 'wait_for_element',
            description: 'Wait for an element to appear on the page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector to wait for'
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                  default: 30000
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['selector']
            }
          },
          {
            name: 'execute_script',
            description: 'Execute JavaScript code in the browser context',
            inputSchema: {
              type: 'object',
              properties: {
                script: {
                  type: 'string',
                  description: 'JavaScript code to execute'
                },
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: ['script']
            }
          },
          {
            name: 'get_page_source',
            description: 'Get the HTML source of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID',
                  default: 'default'
                }
              },
              required: []
            }
          },
          {
            name: 'close_browser',
            description: 'Close a browser session',
            inputSchema: {
              type: 'object',
              properties: {
                sessionId: {
                  type: 'string',
                  description: 'Browser session ID to close',
                  default: 'default'
                }
              },
              required: []
            }
          }
        ] as Tool[]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);
          case 'navigate_to':
            return await this.navigateTo(args);
          case 'click_element':
            return await this.clickElement(args);
          case 'fill_input':
            return await this.fillInput(args);
          case 'get_text':
            return await this.getText(args);
          case 'take_screenshot':
            return await this.takeScreenshot(args);
          case 'wait_for_element':
            return await this.waitForElement(args);
          case 'execute_script':
            return await this.executeScript(args);
          case 'get_page_source':
            return await this.getPageSource(args);
          case 'close_browser':
            return await this.closeBrowser(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    });
  }

  private async launchBrowser(args: any) {
    const { browserType = 'chromium', headless = true, sessionId = 'default' } = args;

    // Close existing session if it exists
    if (this.activeSessions.has(sessionId)) {
      await this.closeBrowser({ sessionId });
    }

    let browser: Browser;
    switch (browserType) {
      case 'chromium':
        browser = await chromium.launch({ headless });
        break;
      case 'firefox':
        browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        browser = await webkit.launch({ headless });
        break;
      default:
        throw new Error(`Unsupported browser type: ${browserType}`);
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    this.activeSessions.set(sessionId, {
      browser,
      context,
      page,
      type: browserType
    });

    return {
      content: [
        {
          type: 'text',
          text: `Successfully launched ${browserType} browser with session ID: ${sessionId}`
        }
      ]
    };
  }

  private async navigateTo(args: any) {
    const { url, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    await session.page.goto(url);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully navigated to: ${url}`
        }
      ]
    };
  }

  private async clickElement(args: any) {
    const { selector, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    await session.page.click(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully clicked element: ${selector}`
        }
      ]
    };
  }

  private async fillInput(args: any) {
    const { selector, text, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    await session.page.fill(selector, text);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully filled input ${selector} with: ${text}`
        }
      ]
    };
  }

  private async getText(args: any) {
    const { selector, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    const text = await session.page.textContent(selector);
    
    return {
      content: [
        {
          type: 'text',
          text: `Text content: ${text || 'No text found'}`
        }
      ]
    };
  }

  private async takeScreenshot(args: any) {
    const { path = 'screenshot.png', fullPage = false, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    await session.page.screenshot({ path, fullPage });
    
    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to: ${path}`
        }
      ]
    };
  }

  private async waitForElement(args: any) {
    const { selector, timeout = 30000, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    await session.page.waitForSelector(selector, { timeout });
    
    return {
      content: [
        {
          type: 'text',
          text: `Element appeared: ${selector}`
        }
      ]
    };
  }

  private async executeScript(args: any) {
    const { script, sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    const result = await session.page.evaluate(script);
    
    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result, null, 2)}`
        }
      ]
    };
  }

  private async getPageSource(args: any) {
    const { sessionId = 'default' } = args;
    const session = this.getSession(sessionId);
    
    const content = await session.page.content();
    
    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ]
    };
  }

  private async closeBrowser(args: any) {
    const { sessionId = 'default' } = args;
    
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active session found with ID: ${sessionId}`);
    }

    await session.browser.close();
    this.activeSessions.delete(sessionId);
    
    return {
      content: [
        {
          type: 'text',
          text: `Browser session ${sessionId} closed successfully`
        }
      ]
    };
  }

  private getSession(sessionId: string): BrowserSession {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`No active browser session found with ID: ${sessionId}. Please launch a browser first.`);
    }
    return session;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async cleanup() {
    // Close all active browser sessions
    for (const [sessionId, session] of this.activeSessions) {
      try {
        await session.browser.close();
      } catch (error) {
        console.error(`Error closing session ${sessionId}:`, error);
      }
    }
    this.activeSessions.clear();
  }
}

export default PlaywrightMCPServer;
