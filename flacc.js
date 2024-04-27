const { spawn } = require('child_process');
const { unlink, readdir } = require('fs/promises');
const path = require('path');

function convertToFlac(inputFile) {
    return new Promise(async (resolve, reject) => {
        // Execute vgmstream-cli.exe
        const vgmstream = spawn('C:/Users/Inrix/Downloads/vgmstream-win64/vgmstream-cli.exe', [inputFile], {
			stdio: 'ignore'
		});

		// vgmstream.on("error", reject);
		// let vgErr = '';
		// vgmstream.stderr.on("data", err => vgErr += err.toString());
        
		vgmstream.on('close', (code) => {
            if (code !== 0) return reject();

			const wavFile = `${inputFile}.wav`;

            // Execute ffmpeg on the generated WAV file
            const ffmpeg = spawn('ffmpeg', ['-i', wavFile, '-c:a', 'flac', '-compression_level', '12', `${inputFile.replace(".wem", "")}.flac`, '-y'], {
				stdio: 'ignore'
			});

			// ffmpeg.on("error", reject);
			// let ffErr = '';
			// ffmpeg.stderr.on("data", err => ffErr += err.toString());
			
            ffmpeg.on('close', (code) => {
                if (code !== 0) return reject();

                // Remove the intermediary WAV file
                unlink(wavFile).catch(reject).then(resolve);
            });
        });
    });
}

export async function* traverseDirectory(directory) {
    const files = await readdir(directory, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
            yield* traverseDirectory(fullPath);  // Recursively traverse directories
        } else {
            yield fullPath;  // Yield file paths
        }
    }
}

// Example usage:
(async () => {
    const rootDirectory = 'I:\\BG3Dump\\Audio'; // Replace with your starting directory path
	let done = total = err = 0;
	for await (const filePath of traverseDirectory(rootDirectory)) {
		if (!filePath.endsWith('.wem')) continue;
		total++;
		let prom = convertToFlac(filePath).then(() => process.stdout.write(`\r${++done} [${err}]/${total}`)).catch(() => process.stdout.write(`\r${done} [${++err}]/${total}`))
		if (total % 64 === 0) await prom;
	}
})();