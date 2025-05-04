#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const cli_table3_1 = __importDefault(require("cli-table3"));
// Author information
const AUTHOR = "Ankush Mehra";
const VERSION = "1.0.3";
// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    targetPath: process.cwd(), // Default to current directory
    include: [],
    exclude: ['node_modules', '.git', 'dist', 'build'],
    countEmptyLines: true,
    countCommentLines: true,
    recursive: true,
    showHelp: false,
    outputFormat: 'table',
    sortBy: 'lines',
    limit: 10
};
// Process arguments
let i = 0;
while (i < args.length) {
    const arg = args[i];
    if (arg === '--include' || arg === '-i') {
        const extensions = ((_a = args[++i]) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
        options.include = extensions.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
    }
    else if (arg === '--exclude' || arg === '-e') {
        options.exclude = ((_b = args[++i]) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
    }
    else if (arg === '--no-empty') {
        options.countEmptyLines = false;
    }
    else if (arg === '--no-comments') {
        options.countCommentLines = false;
    }
    else if (arg === '--no-recursive') {
        options.recursive = false;
    }
    else if (arg === '--format') {
        const format = args[++i];
        if (format === 'table' || format === 'json' || format === 'simple') {
            options.outputFormat = format;
        }
    }
    else if (arg === '--sort') {
        const sortBy = args[++i];
        if (sortBy === 'extension' || sortBy === 'lines' || sortBy === 'files') {
            options.sortBy = sortBy;
        }
    }
    else if (arg === '--limit') {
        const limit = parseInt(args[++i] || '10', 10);
        options.limit = isNaN(limit) ? 10 : limit;
    }
    else if (arg === '--help' || arg === '-h') {
        options.showHelp = true;
    }
    else if (arg === '--version' || arg === '-v') {
        console.log(`${chalk_1.default.cyan('ts-code-line-counter')} ${chalk_1.default.yellow(`v${VERSION}`)} by ${chalk_1.default.green(AUTHOR)}`);
        process.exit(0);
    }
    else if (!arg.startsWith('-')) {
        // Assume it's the target path
        options.targetPath = arg;
    }
    i++;
}
/**
 * Display help information with improved formatting
 */
function showHelp() {
    console.log(chalk_1.default.cyan(figlet_1.default.textSync('CodeCount', { font: 'Standard' })));
    console.log('\n' + chalk_1.default.bold('CODE LINE COUNTER') + ' - Count lines of code in files and directories');
    console.log(chalk_1.default.gray(`v${VERSION} by ${AUTHOR}\n`));
    console.log(chalk_1.default.yellow('USAGE:'));
    console.log('  ts-code-line-counter [options] [path]\n');
    console.log(chalk_1.default.yellow('OPTIONS:'));
    console.log('  --include, -i      ' + chalk_1.default.gray('File extensions to include (comma separated, e.g. js,ts,py)'));
    console.log('  --exclude, -e      ' + chalk_1.default.gray('Paths to exclude (comma separated, e.g. node_modules,dist)'));
    console.log('  --no-empty         ' + chalk_1.default.gray('Don\'t count empty lines'));
    console.log('  --no-comments      ' + chalk_1.default.gray('Don\'t count comment lines'));
    console.log('  --no-recursive     ' + chalk_1.default.gray('Don\'t search directories recursively'));
    console.log('  --format           ' + chalk_1.default.gray('Output format (table, json, simple) [default: table]'));
    console.log('  --sort             ' + chalk_1.default.gray('Sort by (extension, lines, files) [default: lines]'));
    console.log('  --limit            ' + chalk_1.default.gray('Limit number of file types shown [default: 10]'));
    console.log('  --version, -v      ' + chalk_1.default.gray('Show version information'));
    console.log('  --help, -h         ' + chalk_1.default.gray('Show this help message\n'));
    console.log(chalk_1.default.yellow('EXAMPLES:'));
    console.log('  ts-code-line-counter                     ' + chalk_1.default.gray('Count lines in current directory'));
    console.log('  ts-code-line-counter ./src               ' + chalk_1.default.gray('Count lines in ./src directory'));
    console.log('  ts-code-line-counter -i js,ts            ' + chalk_1.default.gray('Count only JavaScript and TypeScript files'));
    console.log('  ts-code-line-counter --no-empty          ' + chalk_1.default.gray('Don\'t count empty lines'));
    console.log('  ts-code-line-counter --format json       ' + chalk_1.default.gray('Output in JSON format'));
    console.log('  ts-code-line-counter --sort extension    ' + chalk_1.default.gray('Sort by file extension'));
}
/**
 * Format file size to human readable format
 */
function formatFileSize(bytes) {
    if (bytes < 1024)
        return bytes + ' B';
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024)
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
/**
 * Format a number with thousands separators
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/**
 * Calculate total size of files in the breakdown
 */
function calculateTotalSize(fileBreakdown) {
    return Object.values(fileBreakdown).reduce((total, file) => total + (file.size || 0), 0);
}
/**
 * Display results in a colorful table format
 */
function displayTableResults(result, targetPath) {
    console.log('\n' + chalk_1.default.cyan(figlet_1.default.textSync('CodeCount', { font: 'Mini' })));
    console.log(chalk_1.default.gray(`v${VERSION} by ${AUTHOR}`) + '\n');
    // Summary box
    const summaryTable = new cli_table3_1.default({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        style: { head: ['cyan', 'bold'], border: ['gray'] }
    });
    const totalFiles = Object.keys(result.fileBreakdown).length;
    const totalSize = calculateTotalSize(result.fileBreakdown);
    summaryTable.push([{ content: chalk_1.default.bold.white('SUMMARY'), colSpan: 2, hAlign: 'center' }], [chalk_1.default.yellow('Target Path:'), chalk_1.default.white(path.resolve(targetPath))], [chalk_1.default.yellow('Total Files:'), chalk_1.default.white(formatNumber(totalFiles))], [chalk_1.default.yellow('Total Size:'), chalk_1.default.white(formatFileSize(totalSize))], [chalk_1.default.yellow('Total Lines:'), chalk_1.default.white(formatNumber(result.totalLines))], [chalk_1.default.yellow('Code Lines:'), chalk_1.default.white(formatNumber(result.codeLines)) + chalk_1.default.gray(` (${(result.codeLines / result.totalLines * 100).toFixed(1)}%)`)], [chalk_1.default.yellow('Comment Lines:'), chalk_1.default.white(formatNumber(result.commentLines)) + chalk_1.default.gray(` (${(result.commentLines / result.totalLines * 100).toFixed(1)}%)`)], [chalk_1.default.yellow('Empty Lines:'), chalk_1.default.white(formatNumber(result.emptyLines)) + chalk_1.default.gray(` (${(result.emptyLines / result.totalLines * 100).toFixed(1)}%)`)]);
    console.log(summaryTable.toString());
    console.log();
    // File type breakdown
    const fileTypeStats = {};
    Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]) => {
        const ext = path.extname(filePath).toLowerCase() || '(no extension)';
        if (!fileTypeStats[ext]) {
            fileTypeStats[ext] = { files: 0, lines: 0, code: 0, comments: 0, empty: 0, size: 0 };
        }
        fileTypeStats[ext].files++;
        fileTypeStats[ext].lines += fileResult.totalLines;
        fileTypeStats[ext].code += fileResult.codeLines;
        fileTypeStats[ext].comments += fileResult.commentLines;
        fileTypeStats[ext].empty += fileResult.emptyLines;
        fileTypeStats[ext].size += fileResult.size || 0;
    });
    // Sort the file types based on the option
    let sortedFileTypes = Object.entries(fileTypeStats);
    if (options.sortBy === 'extension') {
        sortedFileTypes.sort(([extA], [extB]) => extA.localeCompare(extB));
    }
    else if (options.sortBy === 'lines') {
        sortedFileTypes.sort(([, statsA], [, statsB]) => statsB.lines - statsA.lines);
    }
    else if (options.sortBy === 'files') {
        sortedFileTypes.sort(([, statsA], [, statsB]) => statsB.files - statsA.files);
    }
    // Limit the number of file types shown
    sortedFileTypes = sortedFileTypes.slice(0, options.limit);
    const breakdownTable = new cli_table3_1.default({
        head: [
            chalk_1.default.cyan('Extension'),
            chalk_1.default.cyan('Files'),
            chalk_1.default.cyan('Lines'),
            chalk_1.default.cyan('Code'),
            chalk_1.default.cyan('Comments'),
            chalk_1.default.cyan('Empty'),
            chalk_1.default.cyan('Size')
        ],
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        style: { head: ['cyan', 'bold'], border: ['gray'] }
    });
    sortedFileTypes.forEach(([ext, stats]) => {
        breakdownTable.push([
            chalk_1.default.yellow(ext),
            formatNumber(stats.files),
            formatNumber(stats.lines),
            formatNumber(stats.code) + chalk_1.default.gray(` (${(stats.code / stats.lines * 100).toFixed(1)}%)`),
            formatNumber(stats.comments) + chalk_1.default.gray(` (${(stats.comments / stats.lines * 100).toFixed(1)}%)`),
            formatNumber(stats.empty) + chalk_1.default.gray(` (${(stats.empty / stats.lines * 100).toFixed(1)}%)`),
            formatFileSize(stats.size)
        ]);
    });
    console.log(chalk_1.default.bold('FILE TYPE BREAKDOWN:'));
    console.log(breakdownTable.toString());
    // Visualize proportions with bar chart
    console.log('\n' + chalk_1.default.bold('CODE COMPOSITION:'));
    const barWidth = 40;
    const codeRatio = result.codeLines / result.totalLines;
    const commentRatio = result.commentLines / result.totalLines;
    const emptyRatio = result.emptyLines / result.totalLines;
    const codeChars = Math.round(codeRatio * barWidth);
    const commentChars = Math.round(commentRatio * barWidth);
    const emptyChars = Math.round(emptyRatio * barWidth);
    console.log(`${chalk_1.default.green('■').repeat(codeChars)}${chalk_1.default.blue('■').repeat(commentChars)}${chalk_1.default.gray('■').repeat(emptyChars)} ${formatNumber(result.totalLines)} lines`);
    console.log(`${chalk_1.default.green('■')} Code ${(codeRatio * 100).toFixed(1)}%  ` +
        `${chalk_1.default.blue('■')} Comments ${(commentRatio * 100).toFixed(1)}%  ` +
        `${chalk_1.default.gray('■')} Empty ${(emptyRatio * 100).toFixed(1)}%`);
    // Tips
    console.log('\n' + chalk_1.default.gray('Tip: Use --format json for machine-readable output'));
    console.log(chalk_1.default.gray('Tip: Use --help to see all available options'));
}
/**
 * Display results in simple text format
 */
function displaySimpleResults(result, targetPath) {
    console.log('\n=== CODE LINE COUNTER RESULTS ===\n');
    console.log(`Version: ${VERSION} | Author: ${AUTHOR}`);
    console.log(`Target: ${path.resolve(targetPath)}`);
    console.log(`Total files: ${Object.keys(result.fileBreakdown).length}`);
    console.log(`Total lines: ${result.totalLines}`);
    console.log(`Code lines: ${result.codeLines} (${(result.codeLines / result.totalLines * 100).toFixed(1)}%)`);
    console.log(`Comment lines: ${result.commentLines} (${(result.commentLines / result.totalLines * 100).toFixed(1)}%)`);
    console.log(`Empty lines: ${result.emptyLines} (${(result.emptyLines / result.totalLines * 100).toFixed(1)}%)`);
    console.log('\n=== BREAKDOWN BY FILE TYPE ===\n');
    const fileTypeStats = {};
    Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]) => {
        const ext = path.extname(filePath).toLowerCase() || '(no extension)';
        if (!fileTypeStats[ext]) {
            fileTypeStats[ext] = { files: 0, lines: 0 };
        }
        fileTypeStats[ext].files++;
        fileTypeStats[ext].lines += fileResult.totalLines;
    });
    Object.entries(fileTypeStats).forEach(([ext, stats]) => {
        console.log(`${ext}: ${stats.files} files, ${stats.lines} lines`);
    });
}
/**
 * Main CLI function
 */
function main() {
    if (options.showHelp) {
        showHelp();
        process.exit(0);
    }
    // If no specific extensions are provided, use defaults
    if (options.include.length === 0) {
        options.include = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.html', '.css', '.php', '.go', '.swift', '.rb'];
    }
    console.log(chalk_1.default.gray(`Scanning ${options.targetPath}...`));
    // Execute the count
    const result = (0, index_1.countLines)(options.targetPath, {
        include: options.include,
        exclude: options.exclude,
        countEmptyLines: options.countEmptyLines,
        countCommentLines: options.countCommentLines,
        recursive: options.recursive
    });
    if (result) {
        // Add file sizes to the result
        Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]) => {
            try {
                const stats = require('fs').statSync(filePath);
                fileResult.size = stats.size;
            }
            catch (error) {
                fileResult.size = 0;
            }
        });
        if (options.outputFormat === 'json') {
            // Add metadata to JSON output
            const outputResult = {
                ...result,
                _meta: {
                    version: VERSION,
                    author: AUTHOR,
                    timestamp: new Date().toISOString()
                }
            };
            // Output in JSON format
            console.log(JSON.stringify(outputResult, null, 2));
        }
        else if (options.outputFormat === 'simple') {
            // Simple text output
            displaySimpleResults(result, options.targetPath);
        }
        else {
            // Table format (default)
            displayTableResults(result, options.targetPath);
        }
    }
    else {
        console.error(chalk_1.default.red('Error: Failed to count lines. Please check the path and try again.'));
        process.exit(1);
    }
}
// Run the CLI
main();
