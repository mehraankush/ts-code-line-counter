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
 * Counts lines in a single file
 * @param filePath - Path to the file
 * @param options - Configuration options
 * @returns Line count statistics or null if file cannot be read
 */
export declare function countLinesInFile(filePath: string, options?: Partial<CountOptions>): FileCountResult | null;
/**
 * Counts lines in files within a directory
 * @param dirPath - Path to the directory
 * @param options - Configuration options
 * @returns Aggregated line count statistics
 */
export declare function countLinesInDirectory(dirPath: string, options?: Partial<CountOptions>): CountResult;
/**
 * Main function to count lines in a path (file or directory)
 * @param targetPath - Path to count lines in
 * @param options - Configuration options
 * @returns Line count statistics or null if path cannot be processed
 */
export declare function countLines(targetPath: string, options?: Partial<CountOptions>): CountResult | null;
