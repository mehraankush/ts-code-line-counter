import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration options for line counting
 */
export interface CountOptions {
    /** File extensions to include (e.g., ['.js', '.ts']) */
    include: string[];
    /** File paths or patterns to exclude */
    exclude: string[];
    /** Whether to count empty lines */
    countEmptyLines: boolean;
    /** Whether to count comment lines */
    countCommentLines: boolean;
    /** Whether to search directories recursively */
    recursive: boolean;
}

/**
 * Result object for line count information
 */
export interface CountResult {
    /** Total number of lines */
    totalLines: number;
    /** Number of code lines */
    codeLines: number;
    /** Number of comment lines */
    commentLines: number;
    /** Number of empty lines */
    emptyLines: number;
    /** Breakdown of lines by file */
    fileBreakdown: Record<string, FileCountResult>;
}

/**
 * Result object for a single file's line count
 */
export interface FileCountResult {
    /** Total number of lines */
    totalLines: number;
    /** Number of code lines */
    codeLines: number;
    /** Number of comment lines */
    commentLines: number;
    /** Number of empty lines */
    emptyLines: number;
}

/**
 * Type definition for comment detector functions
 */
type CommentDetector = (line: string) => boolean;

/**
 * Counts lines in a single file
 * @param filePath - Path to the file
 * @param options - Configuration options
 * @returns Line count statistics or null if file cannot be read
 */
// In src/index.ts, update the countLinesInFile function

export function countLinesInFile(filePath: string, options: Partial<CountOptions> = {}): FileCountResult | null {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Use this approach to handle different line endings consistently
        const lines = content.split(/\r?\n/);

        // Check if the last line is empty (happens when file ends with newline)
        const hasTrailingNewline = content.endsWith('\n');
        const effectiveLines = hasTrailingNewline && lines.length > 0 ? lines.slice(0, -1) : lines;

        const result: FileCountResult = {
            totalLines: effectiveLines.length,
            codeLines: 0,
            commentLines: 0,
            emptyLines: 0
        };

        const fileExt = path.extname(filePath).toLowerCase();
        const isCommentLine = createCommentDetector(fileExt);

        for (const line of effectiveLines) {
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                result.emptyLines++;
            } else if (isCommentLine(trimmedLine)) {
                result.commentLines++;
            } else {
                result.codeLines++;
            }
        }

        // Adjust counts based on options
        if (options.countEmptyLines === false) {
            result.totalLines -= result.emptyLines;
        }

        if (options.countCommentLines === false) {
            result.totalLines -= result.commentLines;
        }

        return result;
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}
/**
 * Creates a function to detect comments based on file extension
 * @param fileExtension - File extension (e.g., '.js')
 * @returns Function that determines if a line is a comment
 */
function createCommentDetector(fileExtension: string): CommentDetector {
    // Define comment patterns for different file types
    const commentPatterns: Record<string, CommentDetector> = {
        '.js': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.ts': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.py': line => line.startsWith('#'),
        '.rb': line => line.startsWith('#'),
        '.java': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.c': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.cpp': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.cs': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.html': line => line.startsWith('<!--') || line.endsWith('-->'),
        '.css': line => line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.php': line => line.startsWith('//') || line.startsWith('#') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
        '.go': line => line.startsWith('//'),
        '.swift': line => line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/') || !!line.match(/^\s*\*\s/),
    };

    // Default to JavaScript-style comments if extension not found
    return commentPatterns[fileExtension] || commentPatterns['.js'];
}

/**
 * Counts lines in files within a directory
 * @param dirPath - Path to the directory
 * @param options - Configuration options
 * @returns Aggregated line count statistics
 */
export function countLinesInDirectory(dirPath: string, options: Partial<CountOptions> = {}): CountResult {
    const defaultOptions: CountOptions = {
        include: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.html', '.css', '.php', '.go', '.swift', '.rb'],
        exclude: ['node_modules', '.git', 'dist', 'build'],
        countEmptyLines: true,
        countCommentLines: true,
        recursive: true
    };

    const mergedOptions: CountOptions = { ...defaultOptions, ...options };

    const result: CountResult = {
        totalLines: 0,
        codeLines: 0,
        commentLines: 0,
        emptyLines: 0,
        fileBreakdown: {}
    };

    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);

            // Check if path should be excluded
            if (mergedOptions.exclude.some(pattern => itemPath.includes(pattern))) {
                continue;
            }

            const stats = fs.statSync(itemPath);

            if (stats.isDirectory() && mergedOptions.recursive) {
                // Recursively process subdirectories
                const subDirResult = countLinesInDirectory(itemPath, mergedOptions);

                // Aggregate results
                result.totalLines += subDirResult.totalLines;
                result.codeLines += subDirResult.codeLines;
                result.commentLines += subDirResult.commentLines;
                result.emptyLines += subDirResult.emptyLines;

                // Merge file breakdown
                Object.assign(result.fileBreakdown, subDirResult.fileBreakdown);
            } else if (stats.isFile()) {
                const fileExt = path.extname(itemPath).toLowerCase();

                // Process only included file types
                if (mergedOptions.include.includes(fileExt)) {
                    const fileResult = countLinesInFile(itemPath, mergedOptions);

                    if (fileResult) {
                        // Aggregate results
                        result.totalLines += fileResult.totalLines;
                        result.codeLines += fileResult.codeLines;
                        result.commentLines += fileResult.commentLines;
                        result.emptyLines += fileResult.emptyLines;

                        // Add to file breakdown
                        result.fileBreakdown[itemPath] = fileResult;
                    }
                }
            }
        }

        return result;
    } catch (error) {
        console.error(`Error processing directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
        return result;
    }
}

/**
 * Main function to count lines in a path (file or directory)
 * @param targetPath - Path to count lines in
 * @param options - Configuration options
 * @returns Line count statistics or null if path cannot be processed
 */
export function countLines(targetPath: string, options: Partial<CountOptions> = {}): CountResult | null {
    const resolvedPath = path.resolve(targetPath);

    try {
        const stats = fs.statSync(resolvedPath);

        if (stats.isDirectory()) {
            return countLinesInDirectory(resolvedPath, options);
        } else if (stats.isFile()) {
            const result = countLinesInFile(resolvedPath, options);

            if (result) {
                return {
                    totalLines: result.totalLines,
                    codeLines: result.codeLines,
                    commentLines: result.commentLines,
                    emptyLines: result.emptyLines,
                    fileBreakdown: { [resolvedPath]: result }
                };
            } else {
                return null;
            }
        } else {
            throw new Error(`Path ${resolvedPath} is neither a file nor a directory`);
        }
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
}