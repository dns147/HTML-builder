const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeableStream = fs.createWriteStream(filePath);

const mergeFile = file => {
  const fileExt = path.parse(file).ext.slice(1);
  const fPath = path.join(__dirname, 'styles', file);

  fs.stat(fPath, (err, stats) => {
    if (err) {
      throw err;
    }

    if (!stats.isDirectory() && fileExt === 'css') {
      const stream = fs.createReadStream(fPath);

      stream.on('data', data => {
        const dataFile = Buffer.from(data);
        writeableStream.write(dataFile.toString() + '\n');
      })
    }
  });
};

fs.readdir(dirPath, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(mergeFile);
});