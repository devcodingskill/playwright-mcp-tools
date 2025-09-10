# Contributing to MCP Playwright

Thank you for your interest in contributing to MCP Playwright! This guide will help you get started.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/devcodingskill/mcp-playwright.git
   cd mcp-playwright
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Development Workflow

### Running in Development Mode
```bash
npm run dev
```
This starts TypeScript in watch mode, rebuilding on file changes.

### Testing
```bash
npm test
```
Run the test suite to ensure your changes don't break existing functionality.

### Linting
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Building
```bash
npm run build
```

## Project Structure

```
src/
├── server.ts        # Main MCP server implementation
├── index.ts         # Entry point for programmatic usage
├── cli.ts           # Command-line interface
└── __tests__/       # Test files

examples/            # Usage examples
scripts/             # Build and setup scripts
dist/               # Compiled JavaScript output
```

## Adding New Tools

To add a new Playwright automation tool:

1. **Add the tool definition** in `server.ts` to the `ListToolsRequestSchema` handler
2. **Implement the tool logic** in the `CallToolRequestSchema` handler
3. **Add the corresponding method** to the `PlaywrightMCPServer` class
4. **Update documentation** in README.md
5. **Add tests** for the new functionality
6. **Add examples** showing how to use the new tool

### Example Tool Implementation

```typescript
// In the tools array
{
  name: 'new_tool',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      parameter: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['parameter']
  }
}

// In the switch statement
case 'new_tool':
  return await this.newTool(args);

// Implementation method
private async newTool(args: any) {
  const { parameter, sessionId = 'default' } = args;
  const session = this.getSession(sessionId);
  
  // Tool implementation
  
  return {
    content: [
      {
        type: 'text',
        text: 'Tool result'
      }
    ]
  };
}
```

## Testing Guidelines

- Write tests for all new functionality
- Ensure tests clean up browser sessions
- Use descriptive test names
- Mock external dependencies when appropriate
- Test both success and error cases

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Keep functions focused and single-purpose

## Documentation

- Update README.md for new features
- Add examples to the examples/ directory
- Document breaking changes in CHANGELOG.md
- Include inline code comments for complex logic

## Submitting Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** for your changes
5. **Update documentation** as needed
6. **Run the full test suite**
   ```bash
   npm test
   npm run lint
   npm run build
   ```
7. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
9. **Create a Pull Request**

## Commit Message Format

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

## Questions?

Feel free to open an issue for:
- Questions about the codebase
- Feature requests
- Bug reports
- General discussion

Thank you for contributing!
