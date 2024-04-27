const fs = require('fs');
const path = require('path');

/**
 * Recursively compute the size of a directory.
 * @param {string} dirPath - Path of the directory.
 * @returns {number} - Size of the directory in bytes.
 */
function getDirectorySize(dirPath) {
    let totalSize = 0;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            totalSize += getDirectorySize(entryPath);
        } else if (entry.isFile()) {
            const stats = fs.statSync(entryPath);
            totalSize += stats.size;
        }
    }

    return totalSize;
}

const targetDir = "./";  // Modify as needed
const sizeInBytes = getDirectorySize(targetDir);

console.log(`Total size of ${targetDir}: ${sizeInBytes} bytes`);

// Optionally, if you want size in megabytes:
const sizeInMegabytes = (sizeInBytes / (1024 * 1024)).toFixed(2);
console.log(`Total size of ${targetDir}: ${sizeInMegabytes} MB`);
