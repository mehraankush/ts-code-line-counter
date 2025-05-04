
**Author:** Ankush Mehra  
**Repository:** [GitHub - ankushmehra/ts-code-line-counter](https://github.com/ankushmehra69/ts-code-line-counter)

# TypeScript Code Line Counter

A robust and type-safe npm library for counting lines of code in your projects, built with TypeScript.

## Features

- **Type Safety**: Built with TypeScript for better development experience
- **Accurate Counting**: Count lines of code, comments, and empty lines
- **Customizable Filters**: Filter by file extensions and exclude specific directories
- **Command Line Interface**: Easy-to-use CLI tool
- **Detailed Reports**: Get breakdowns by file type
- **Multiple Language Support**: Works with JavaScript, TypeScript, Python, Java, and more

## Installation

### As a dependency in your project

```bash
npm install ts-code-line-counter --save
```

### As a global CLI tool

```bash
npm install -g ts-code-line-counter
```

## Usage

### As a library in TypeScript

```typescript
import { countLines } from 'ts-code-line-counter';

// Count lines in the current project
const result = countLines('.');

if (result) {
  console.log(`Total lines: ${result.totalLines}`);
  console.log(`Code lines: ${result.codeLines}`);
  console.log(`Comment lines: ${result.commentLines}`);
  console.log(`Empty lines: ${result.emptyLines}`);
}

// With options
const options = {
  include: ['.js', '.ts'],           // Only include JavaScript and TypeScript files
  exclude: ['node_modules', '.git'], // Exclude these directories
  countEmptyLines: false,            // Don't count empty lines
  countCommentLines: false,          // Don't count comment lines
  recursive: true                    // Scan directories recursively
};

const customResult = countLines('./src', options);
```

### As a library in JavaScript

```javascript
const { countLines } = require('ts-code-line-counter');

// Usage is the same as in TypeScript
const result = countLines('./src');

if (result) {
  console.log(`Total lines: ${result.totalLines}`);
  // ...
}
```

### As a CLI tool

```bash
# Count lines in the current directory
ts-code-line-counter

# Count lines in a specific directory
ts-code-line-counter ./src

# Count only specific file types
ts-code-line-counter --include js,ts,jsx

# Exclude specific directories
ts-code-line-counter --exclude node_modules,dist,build

# Don't count empty lines
ts-code-line-counter --no-empty

# Don't count comment lines
ts-code-line-counter --no-comments

# Don't search recursively
ts-code-line-counter --no-recursive

# Show help
ts-code-line-counter --help
```

## Supported File Types

By default, the library supports the following file extensions:
- JavaScript: .js, .jsx
- TypeScript: .ts, .tsx
- Python: .py
- Java: .java
- C/C++: .c, .cpp
- C#: .cs
- HTML: .html
- CSS: .css
- PHP: .php
- Go: .go
- Swift: .swift
- Ruby: .rb

You can specify your own list of extensions using the `include` option.

## API Reference

### Types

```typescript
interface CountOptions {
  include: string[];            // File extensions to include
  exclude: string[];            // Paths to exclude
  countEmptyLines: boolean;     // Whether to count empty lines
  countCommentLines: boolean;   // Whether to count comment lines
  recursive: boolean;           // Whether to search directories recursively
}

interface CountResult {
  totalLines: number;           // Total number of lines
  codeLines: number;            // Number of code lines
  commentLines: number;         // Number of comment lines
  emptyLines: number;           // Number of empty lines
  fileBreakdown: Record<string, FileCountResult>; // Breakdown of lines by file
}

interface FileCountResult {
  totalLines: number;           // Total number of lines in the file
  codeLines: number;            // Number of code lines in the file
  commentLines: number;         // Number of comment lines in the file
  emptyLines: number;           // Number of empty lines in the file
}
```

### Functions

#### `countLines(targetPath: string, options?: Partial<CountOptions>): CountResult | null`

Counts lines in a file or directory.

- `targetPath` (string): Path to the file or directory
- `options` (Partial\<CountOptions\>, optional): Configuration options
- Returns: CountResult object or null if the path cannot be processed

#### `countLinesInFile(filePath: string, options?: Partial<CountOptions>): FileCountResult | null`

Counts lines in a single file.

- `filePath` (string): Path to the file
- `options` (Partial\<CountOptions\>, optional): Configuration options
- Returns: FileCountResult object or null if the file cannot be read

#### `countLinesInDirectory(dirPath: string, options?: Partial<CountOptions>): CountResult`

Counts lines in files within a directory.

- `dirPath` (string): Path to the directory
- `options` (Partial\<CountOptions\>, optional): Configuration options
- Returns: CountResult object with aggregated statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run the tests (`npm test`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.