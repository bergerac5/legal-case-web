export function extractFilename(fullPath: string): string {
  // Handle both forward and backward slashes
  const parts = fullPath.split(/[\\/]/);
  // Get the last part (filename) and preserve any minus signs in the actual filename
  return parts.pop() || fullPath;
}