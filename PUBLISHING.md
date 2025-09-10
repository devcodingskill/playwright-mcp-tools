# Publishing MCP Playwright

This guide helps you publish the MCP Playwright package to npm.

## Pre-publishing Checklist

1. **Verify the build**
   ```bash
   npm run build
   npm run lint
   npm test
   node scripts/verify.js
   ```

2. **Update version** (if needed)
   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

3. **Update CHANGELOG.md** with release notes

4. **Test the CLI**
   ```bash
   node dist/cli.js --help
   node dist/cli.js serve
   ```

## Publishing Steps

1. **Login to npm** (first time only)
   ```bash
   npm login
   ```

2. **Dry run publish** (recommended)
   ```bash
   npm publish --dry-run
   ```

3. **Publish to npm**
   ```bash
   npm publish
   ```

## Post-publishing

1. **Create GitHub release** with the same version tag
2. **Update documentation** if needed
3. **Announce** the release in relevant communities

## Package Scope (Optional)

To publish under a scope (e.g., `@devcodingskill/mcp-playwright`):

1. Update `package.json` name field:
   ```json
   {
     "name": "@devcodingskill/mcp-playwright"
   }
   ```

2. Publish with public access:
   ```bash
   npm publish --access public
   ```

## Installation for Users

After publishing, users can install with:

```bash
# Global installation
npm install -g mcp-playwright

# Local installation
npm install mcp-playwright

# With scope
npm install -g @devcodingskill/mcp-playwright
```

## Verification

Test that your published package works:

```bash
# If globally installed
mcp-playwright --help

# If locally installed
npx mcp-playwright --help
```
