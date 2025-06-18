# Publishing Guide for ComponentMap TypeScript Library

## 📋 Pre-Publishing Checklist

### 1. Update Package Information
Before publishing, update these fields in `package.json`:

```json
{
  "name": "@your-npm-username/component-map",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-username/ts-component-map.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/ts-component-map/issues"
  },
  "homepage": "https://github.com/your-username/ts-component-map#readme"
}
```

### 2. Update License
Edit the `LICENSE` file to include your actual name and year.

### 3. Verify Build and Tests
```bash
npm run clean
npm run build
npm test
npm run lint
```

## 🚀 Publishing Steps

### 1. Initial NPM Setup
```bash
# Login to NPM (one-time setup)
npm login

# Verify your identity
npm whoami
```

### 2. Version Management
```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

### 3. Publish to NPM
```bash
# Dry run to see what will be published
npm publish --dry-run

# Actual publish
npm publish
```

### 4. Verify Publication
```bash
# Check if package is available
npm view @your-scope/component-map

# Install in a test project to verify
npm install @your-scope/component-map
```

## 📦 What Gets Published

The `files` field in `package.json` controls what gets included:
- `dist/` - Compiled JavaScript and type definitions
- `README.md` - Documentation
- `LICENSE` - License file

What's excluded (via `.npmignore`):
- Source TypeScript files (`src/`)
- Tests and dev configuration
- Demo files
- Development dependencies

## 🔄 Using in Your Projects

### Installation
```bash
npm install @your-scope/component-map reflect-metadata
```

### Basic Usage
```typescript
import 'reflect-metadata';
import { ComponentMapManager, ComponentMapKey } from '@your-scope/component-map';

// Define your interface
interface MyHandler extends ComponentMapKey<string> {
  handle(data: any): void;
}

// Implement handlers
class Handler1 implements MyHandler {
  getComponentMapKey(): string {
    return 'handler1';
  }
  handle(data: any): void {
    console.log('Handler 1:', data);
  }
}

// Register and use
const registry = ComponentMapManager.getInstance().getRegistry<string, MyHandler>('handlers');
registry.register('handler1', new Handler1());

const handlers = registry.getAll();
const handler = handlers.get('handler1');
handler?.handle('test data');
```

## 🏗️ Setting Up in Different Project Types

### 1. Node.js Project
```bash
npm install @your-scope/component-map reflect-metadata
```

Add to your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Import at the top of your main file:
```typescript
import 'reflect-metadata';
```

### 2. NestJS Project
```bash
npm install @your-scope/component-map
```

NestJS already includes `reflect-metadata`, so you can use ComponentMap directly:

```typescript
import { Injectable } from '@nestjs/common';
import { ComponentMapManager } from '@your-scope/component-map';

@Injectable()
export class MyService {
  private handlers = ComponentMapManager.getInstance()
    .getRegistry<string, MyHandler>('handlers')
    .getAll();
}
```

### 3. Express.js Project
```typescript
import 'reflect-metadata';
import express from 'express';
import { ComponentMapManager } from '@your-scope/component-map';

const app = express();

// Use ComponentMap in your routes
app.get('/api/process/:type', (req, res) => {
  const handlers = ComponentMapManager.getInstance()
    .getRegistry<string, ProcessHandler>('processors')
    .getAll();
    
  const handler = handlers.get(req.params.type);
  if (handler) {
    const result = handler.process(req.body);
    res.json(result);
  } else {
    res.status(404).json({ error: 'Handler not found' });
  }
});
```

## 🧪 Testing in Consumer Projects

Create a simple test to verify the library works:

```typescript
// test-component-map.ts
import 'reflect-metadata';
import { ComponentMapManager, ComponentMapKey } from '@your-scope/component-map';

interface TestHandler extends ComponentMapKey<string> {
  execute(): string;
}

class TestHandlerImpl implements TestHandler {
  getComponentMapKey(): string {
    return 'test';
  }
  
  execute(): string {
    return 'ComponentMap is working!';
  }
}

// Test the functionality
const manager = ComponentMapManager.getInstance();
const registry = manager.getRegistry<string, TestHandler>('test-handlers');

registry.register('test', new TestHandlerImpl());

const handlers = registry.getAll();
const handler = handlers.get('test');

console.log(handler?.execute()); // Should print: "ComponentMap is working!"
```

## 🔧 Maintenance

### Updating Dependencies
```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Update TypeScript and rebuild
npm install typescript@latest --save-dev
npm run rebuild
```

### Adding New Features
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Run full test suite
6. Update version
7. Publish

### Supporting Multiple TypeScript Versions
Test your library against different TypeScript versions:

```bash
# Test with different TS versions
npm install typescript@4.9 --save-dev
npm run build && npm test

npm install typescript@5.0 --save-dev  
npm run build && npm test
```

## 📊 Package Stats and Monitoring

After publishing, monitor your package:

```bash
# View package details
npm view @your-scope/component-map

# Check download stats
npm view @your-scope/component-map downloads

# Monitor versions
npm view @your-scope/component-map versions --json
```

## 🛡️ Security Considerations

1. **Audit dependencies regularly:**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Use exact versions for critical dependencies**
3. **Keep TypeScript and other dev dependencies updated**
4. **Review PRs carefully if accepting contributions**

## 📈 Best Practices for Library Maintenance

1. **Semantic Versioning:** Follow semver strictly
2. **Changelog:** Maintain a CHANGELOG.md
3. **Documentation:** Keep README and examples updated
4. **Backward Compatibility:** Avoid breaking changes in minor/patch releases
5. **Testing:** Maintain high test coverage
6. **Performance:** Monitor bundle size and performance
7. **Community:** Respond to issues and PRs promptly 