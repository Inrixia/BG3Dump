const fs = require('fs');
const path = require('path');

/**
 * Recursively list folders containing files with the specified extension.
 * @param {string} dir - Starting directory.
 * @param {string} ext - File extension to search for (e.g., '.txt').
 * @returns {Set<string>} - Set of directories containing the desired files.
 */
function findFoldersWithExtension(dir, ext) {
    let result = new Set();

    function traverse(directory) {
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        let hasTargetFile = false;
        for (const entry of entries) {
            if (entry.isDirectory()) {
                traverse(path.join(directory, entry.name));
            } else if (path.extname(entry.name) === ext) {
                hasTargetFile = true;
            }
        }

        if (hasTargetFile) {
            result.add(directory);
        }
    }

    traverse(dir);

    return result;
}

const targetDir = './';  // Starting directory (modify as needed)
const targetExt = '.wem';  // Desired file extension (modify as needed)
const folders = findFoldersWithExtension(targetDir, targetExt);

console.log("Folders containing files with extension", targetExt, ":");
folders.forEach(folder => {
    console.log(folder);
});
