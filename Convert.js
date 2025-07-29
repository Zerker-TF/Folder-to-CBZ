//in the folder path, converts all folders into cbz files.
//run npm install archiver before running this script
//usage: node Convert.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const archiver = require('archiver');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path to the parent folder: ', (folderPath) => {
    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
        console.error('Invalid folder path.');
        rl.close();
        return;
    }

    const subfolders = fs.readdirSync(folderPath).filter(name => {
        const fullPath = path.join(folderPath, name);
        return fs.lstatSync(fullPath).isDirectory();
    });

    if (subfolders.length === 0) {
        console.log('No subfolders found.');
        rl.close();
        return;
    }

    subfolders.forEach(subfolder => {
        const subfolderPath = path.join(folderPath, subfolder);
        const outputFile = path.join(folderPath, `${subfolder}.cbz`);
        const output = fs.createWriteStream(outputFile);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`${outputFile} created (${archive.pointer()} bytes)`);
        });

        archive.on('error', err => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(subfolderPath, false);
        archive.finalize();
    });

    rl.close();
});