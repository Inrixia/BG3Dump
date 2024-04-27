const { createReadStream, existsSync, mkdirSync, rename } = require('fs');
const path = require('path');
const readline = require('readline');

function extractSourceIDs(filename) {
    return new Promise((res) => {
        const result = {};

        let currentBnkName = null;

        const readInterface = readline.createInterface({
            input: createReadStream(filename, 'utf-8'),
            output: process.stdout,
            terminal: false
        });
    
        readInterface.on('line', function(line) {
            const bnkMatch = line.match(/dwSoundBankID = \d+ \(([^)]+)\)/);
            const sourceIDMatch = line.match(/tid  sourceID = (\d+)/);
    
            if (bnkMatch) {
                currentBnkName = bnkMatch[1];
                result[currentBnkName] = [];
            } else if (sourceIDMatch && currentBnkName) {
                const sourceID = parseInt(sourceIDMatch[1], 10);
                result[currentBnkName].push(sourceID);
            }
        });
    
        readInterface.once("close", () => {
            // Removing any empty arrays (bnk names with no sourceIDs)
            for (let bnkName in result) {
                if (result[bnkName].length === 0) {
                    delete result[bnkName];
                }
            }

            res(result)
        })
    })
}

function moveWemFiles(sourceIDs, baseDir) {
    const currentDir = process.cwd();

    for (let bnkName in sourceIDs) {
        const bnkDir = path.join(currentDir, `${baseDir}/${bnkName}`);

        if (!existsSync(bnkDir)) {
            mkdirSync(bnkDir, { recursive: true });
        }

        for (let id of sourceIDs[bnkName]) {
            const srcFile = path.join(currentDir, baseDir, `${id}.wem`);
            const destFile = path.join(bnkDir, `${id}.wem`);

            if (existsSync(srcFile)) {
                rename(srcFile, destFile, () => null)
            }
        }
    }
}

(async () => {
    const sourceIDs = await extractSourceIDs('./banks-Merge-Public-Shared-Assets-Sound.txt');

    // let sum = 0;
    // for (const key in sourceIDs) {
    //     console.log(key, sourceIDs[key].length);
    //     sum+= sourceIDs[key].length;
    // }
    // console.log(sum);
    
    moveWemFiles(sourceIDs, './PublicSharedAssetsSound');
})();