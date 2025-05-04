#!/usr/bin/env node

import { countLines } from './index';
import * as path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import Table from 'cli-table3';

// Author information
const AUTHOR = "Ankush Mehra";
const VERSION = "1.0.3";

interface CliOptions {
    targetPath: string;
    include: string[];
    exclude: string[];
    countEmptyLines: boolean;
    countCommentLines: boolean;
    recursive: boolean;
    showHelp: boolean;
    outputFormat: 'table' | 'json' | 'simple';
    sortBy: 'extension' | 'lines' | 'files';
    limit: number;
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: CliOptions = {
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
        const extensions = args[++i]?.split(',') || [];
        options.include = extensions.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
    } else if (arg === '--exclude' || arg === '-e') {
        options.exclude = args[++i]?.split(',') || [];
    } else if (arg === '--no-empty') {
        options.countEmptyLines = false;
    } else if (arg === '--no-comments') {
        options.countCommentLines = false;
    } else if (arg === '--no-recursive') {
        options.recursive = false;
    } else if (arg === '--format') {
        const format = args[++i];
        if (format === 'table' || format === 'json' || format === 'simple') {
            options.outputFormat = format;
        }
    } else if (arg === '--sort') {
        const sortBy = args[++i];
        if (sortBy === 'extension' || sortBy === 'lines' || sortBy === 'files') {
            options.sortBy = sortBy;
        }
    } else if (arg === '--limit') {
        const limit = parseInt(args[++i] || '10', 10);
        options.limit = isNaN(limit) ? 10 : limit;
    } else if (arg === '--help' || arg === '-h') {
        options.showHelp = true;
    } else if (arg === '--version' || arg === '-v') {
        console.log(`${chalk.cyan('ts-code-line-counter')} ${chalk.yellow(`v${VERSION}`)} by ${chalk.green(AUTHOR)}`);
        process.exit(0);
    } else if (!arg.startsWith('-')) {
        // Assume it's the target path
        options.targetPath = arg;
    }

    i++;
}

/**
 * Display help information with improved formatting
 */
function showHelp(): void {
    console.log(chalk.cyan(figlet.textSync('CodeCount', { font: 'Standard' })));
    console.log('\n' + chalk.bold('CODE LINE COUNTER') + ' - Count lines of code in files and directories');
    console.log(chalk.gray(`v${VERSION} by ${AUTHOR}\n`));

    console.log(chalk.yellow('USAGE:'));
    console.log('  ts-code-line-counter [options] [path]\n');

    console.log(chalk.yellow('OPTIONS:'));
    console.log('  --include, -i      ' + chalk.gray('File extensions to include (comma separated, e.g. js,ts,py)'));
    console.log('  --exclude, -e      ' + chalk.gray('Paths to exclude (comma separated, e.g. node_modules,dist)'));
    console.log('  --no-empty         ' + chalk.gray('Don\'t count empty lines'));
    console.log('  --no-comments      ' + chalk.gray('Don\'t count comment lines'));
    console.log('  --no-recursive     ' + chalk.gray('Don\'t search directories recursively'));
    console.log('  --format           ' + chalk.gray('Output format (table, json, simple) [default: table]'));
    console.log('  --sort             ' + chalk.gray('Sort by (extension, lines, files) [default: lines]'));
    console.log('  --limit            ' + chalk.gray('Limit number of file types shown [default: 10]'));
    console.log('  --version, -v      ' + chalk.gray('Show version information'));
    console.log('  --help, -h         ' + chalk.gray('Show this help message\n'));

    console.log(chalk.yellow('EXAMPLES:'));
    console.log('  ts-code-line-counter                     ' + chalk.gray('Count lines in current directory'));
    console.log('  ts-code-line-counter ./src               ' + chalk.gray('Count lines in ./src directory'));
    console.log('  ts-code-line-counter -i js,ts            ' + chalk.gray('Count only JavaScript and TypeScript files'));
    console.log('  ts-code-line-counter --no-empty          ' + chalk.gray('Don\'t count empty lines'));
    console.log('  ts-code-line-counter --format json       ' + chalk.gray('Output in JSON format'));
    console.log('  ts-code-line-counter --sort extension    ' + chalk.gray('Sort by file extension'));
}

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

/**
 * Format a number with thousands separators
 */
function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Calculate total size of files in the breakdown
 */
function calculateTotalSize(fileBreakdown: Record<string, any>): number {
    return Object.values(fileBreakdown).reduce((total, file) => total + (file.size || 0), 0);
}

/**
 * Display results in a colorful table format
 */
function displayTableResults(result: any, targetPath: string): void {
    console.log('\n' + chalk.cyan(figlet.textSync('CodeCount', { font: 'Mini' })));
    console.log(chalk.gray(`v${VERSION} by ${AUTHOR}`) + '\n');

    // Summary box
    const summaryTable = new Table({
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

    summaryTable.push(
        [{ content: chalk.bold.white('SUMMARY'), colSpan: 2, hAlign: 'center' }],
        [chalk.yellow('Target Path:'), chalk.white(path.resolve(targetPath))],
        [chalk.yellow('Total Files:'), chalk.white(formatNumber(totalFiles))],
        [chalk.yellow('Total Size:'), chalk.white(formatFileSize(totalSize))],
        [chalk.yellow('Total Lines:'), chalk.white(formatNumber(result.totalLines))],
        [chalk.yellow('Code Lines:'), chalk.white(formatNumber(result.codeLines)) + chalk.gray(` (${(result.codeLines / result.totalLines * 100).toFixed(1)}%)`)],
        [chalk.yellow('Comment Lines:'), chalk.white(formatNumber(result.commentLines)) + chalk.gray(` (${(result.commentLines / result.totalLines * 100).toFixed(1)}%)`)],
        [chalk.yellow('Empty Lines:'), chalk.white(formatNumber(result.emptyLines)) + chalk.gray(` (${(result.emptyLines / result.totalLines * 100).toFixed(1)}%)`)]
    );

    console.log(summaryTable.toString());
    console.log();

    // File type breakdown
    const fileTypeStats: Record<string, { files: number, lines: number, code: number, comments: number, empty: number, size: number }> = {};

    Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]: [string, any]) => {
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
    } else if (options.sortBy === 'lines') {
        sortedFileTypes.sort(([, statsA], [, statsB]) => statsB.lines - statsA.lines);
    } else if (options.sortBy === 'files') {
        sortedFileTypes.sort(([, statsA], [, statsB]) => statsB.files - statsA.files);
    }

    // Limit the number of file types shown
    sortedFileTypes = sortedFileTypes.slice(0, options.limit);

    const breakdownTable = new Table({
        head: [
            chalk.cyan('Extension'),
            chalk.cyan('Files'),
            chalk.cyan('Lines'),
            chalk.cyan('Code'),
            chalk.cyan('Comments'),
            chalk.cyan('Empty'),
            chalk.cyan('Size')
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
            chalk.yellow(ext),
            formatNumber(stats.files),
            formatNumber(stats.lines),
            formatNumber(stats.code) + chalk.gray(` (${(stats.code / stats.lines * 100).toFixed(1)}%)`),
            formatNumber(stats.comments) + chalk.gray(` (${(stats.comments / stats.lines * 100).toFixed(1)}%)`),
            formatNumber(stats.empty) + chalk.gray(` (${(stats.empty / stats.lines * 100).toFixed(1)}%)`),
            formatFileSize(stats.size)
        ]);
    });

    console.log(chalk.bold('FILE TYPE BREAKDOWN:'));
    console.log(breakdownTable.toString());

    // Visualize proportions with bar chart
    console.log('\n' + chalk.bold('CODE COMPOSITION:'));

    const barWidth = 40;
    const codeRatio = result.codeLines / result.totalLines;
    const commentRatio = result.commentLines / result.totalLines;
    const emptyRatio = result.emptyLines / result.totalLines;

    const codeChars = Math.round(codeRatio * barWidth);
    const commentChars = Math.round(commentRatio * barWidth);
    const emptyChars = Math.round(emptyRatio * barWidth);

    console.log(
        `${chalk.green('■').repeat(codeChars)}${chalk.blue('■').repeat(commentChars)}${chalk.gray('■').repeat(emptyChars)} ${formatNumber(result.totalLines)} lines`
    );
    console.log(
        `${chalk.green('■')} Code ${(codeRatio * 100).toFixed(1)}%  ` +
        `${chalk.blue('■')} Comments ${(commentRatio * 100).toFixed(1)}%  ` +
        `${chalk.gray('■')} Empty ${(emptyRatio * 100).toFixed(1)}%`
    );

    // Tips
    console.log('\n' + chalk.gray('Tip: Use --format json for machine-readable output'));
    console.log(chalk.gray('Tip: Use --help to see all available options'));
}

/**
 * Display results in simple text format
 */
function displaySimpleResults(result: any, targetPath: string): void {
    console.log('\n=== CODE LINE COUNTER RESULTS ===\n');
    console.log(`Version: ${VERSION} | Author: ${AUTHOR}`);
    console.log(`Target: ${path.resolve(targetPath)}`);
    console.log(`Total files: ${Object.keys(result.fileBreakdown).length}`);
    console.log(`Total lines: ${result.totalLines}`);
    console.log(`Code lines: ${result.codeLines} (${(result.codeLines / result.totalLines * 100).toFixed(1)}%)`);
    console.log(`Comment lines: ${result.commentLines} (${(result.commentLines / result.totalLines * 100).toFixed(1)}%)`);
    console.log(`Empty lines: ${result.emptyLines} (${(result.emptyLines / result.totalLines * 100).toFixed(1)}%)`);

    console.log('\n=== BREAKDOWN BY FILE TYPE ===\n');

    const fileTypeStats: Record<string, { files: number, lines: number }> = {};

    Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]: [string, any]) => {
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
function main(): void {
    if (options.showHelp) {
        showHelp();
        process.exit(0);
    }

    // If no specific extensions are provided, use defaults
    if (options.include.length === 0) {
        options.include = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.html', '.css', '.php', '.go', '.swift', '.rb'];
    }

    console.log(chalk.gray(`Scanning ${options.targetPath}...`));

    // Execute the count
    const result = countLines(options.targetPath, {
        include: options.include,
        exclude: options.exclude,
        countEmptyLines: options.countEmptyLines,
        countCommentLines: options.countCommentLines,
        recursive: options.recursive
    });

    if (result) {
        // Add file sizes to the result
        Object.entries(result.fileBreakdown).forEach(([filePath, fileResult]: [string, any]) => {
            try {
                const stats = require('fs').statSync(filePath);
                (fileResult as any).size = stats.size;
            } catch (error) {
                (fileResult as any).size = 0;
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
        } else if (options.outputFormat === 'simple') {
            // Simple text output
            displaySimpleResults(result, options.targetPath);
        } else {
            // Table format (default)
            displayTableResults(result, options.targetPath);
        }
    } else {
        console.error(chalk.red('Error: Failed to count lines. Please check the path and try again.'));
        process.exit(1);
    }
}

// Run the CLI
main();