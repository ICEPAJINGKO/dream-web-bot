# Code Formatting & Linting Guide

## Overview

This project uses a comprehensive setup for consistent code formatting and linting across all team members.

## Tools Used

- **ESLint**: Code linting and error detection
- **Prettier**: Code formatting
- **EditorConfig**: Basic editor settings
- **TypeScript**: Type checking

## VS Code Setup

### Required Extensions

Install these extensions (VS Code will prompt you):

- `esbenp.prettier-vscode` - Prettier formatter
- `dbaeumer.vscode-eslint` - ESLint integration
- `editorconfig.editorconfig` - EditorConfig support
- `ms-vscode.vscode-typescript-next` - Enhanced TypeScript support

### Automatic Setup

The workspace settings in `.vscode/settings.json` will automatically:

- Format code on save
- Fix ESLint issues on save
- Organize imports on save
- Use 4-space indentation
- Use Prettier as default formatter

## Available Scripts

### Formatting

```bash
# Format all TypeScript files
npm run format

# Check if files are properly formatted (CI/CD)
npm run format:check
```

### Linting

```bash
# Run ESLint and fix issues automatically
npm run lint:fix

# Check for linting issues without fixing (CI/CD)
npm run lint:check
```

### Combined Commands

```bash
# Format and fix all issues
npm run code:fix

# Check formatting and linting (for CI/CD)
npm run code:check
```

## Configuration Files

### `.prettierrc`

- **tabWidth**: 4 spaces
- **singleQuote**: true
- **trailingComma**: all
- **semi**: true
- **printWidth**: 80 characters

### `eslint.config.mjs`

- TypeScript type checking
- Prettier integration
- Custom rules for NestJS projects
- Warns on unsafe TypeScript operations

### `.editorconfig`

- 4-space indentation
- UTF-8 encoding
- LF line endings
- Final newline insertion

## Team Workflow

### Before Committing

Always run:

```bash
npm run code:fix
```

### CI/CD Integration

Use this command in your pipeline:

```bash
npm run code:check && npm run build
```

## Troubleshooting

### VS Code Not Formatting

1. Ensure Prettier extension is installed
2. Check that `.prettierrc` exists
3. Restart VS Code
4. Run `Developer: Reload Window`

### ESLint Errors

1. Run `npm run lint:fix`
2. Check `eslint.config.mjs` for rule configurations
3. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Formatting Conflicts

1. Run `npm run format` to apply Prettier formatting
2. Run `npm run lint:fix` to fix ESLint issues
3. Both tools are configured to work together

## Benefits

✅ **Consistent Code Style** - All team members use the same formatting
✅ **Automatic Fixing** - Most issues are fixed automatically on save
✅ **Type Safety** - TypeScript strict checking with helpful warnings
✅ **CI/CD Ready** - Easy integration with automated pipelines
✅ **Editor Agnostic** - Works with any editor that supports EditorConfig

## Settings Summary

| Setting         | Value         | Purpose                      |
| --------------- | ------------- | ---------------------------- |
| Indentation     | 4 spaces      | Consistent spacing           |
| Line Width      | 80 characters | Readable code lines          |
| Quotes          | Single quotes | Consistent string style      |
| Semicolons      | Required      | Clear statement endings      |
| Trailing Commas | Always        | Cleaner git diffs            |
| Line Endings    | LF            | Cross-platform compatibility |
