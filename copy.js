const { readdir, copyFile, mkdir } = require('fs/promises');

const src = "I:\\BG3Dump\\Merge\\Public\\SharedDev\\Assets\\Sound";

const dst = "I:\\BG3Dump\\PublicSharedDevAssetsSound";

let total = done = 0;
(async () => {
	await mkdir(dst, { recursive: true });
	for (const file of await readdir(src)) {
		total++;
		copyFile(`${src}/${file}`, `${dst}/${file}`).then(() => {
			process.stdout.write(`\r${++done}/${total}`)
		});
	}}
)();
