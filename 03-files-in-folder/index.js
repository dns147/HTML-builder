const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

const getStatsFile = file => {
  const fileName = path.parse(file).name;
  const fileExt = path.parse(file).ext.slice(1);
  const fPath = path.join(__dirname, 'secret-folder', file);

  fs.stat(fPath, (err, stats) => {
    if (err) {
      throw err;
    }

    if (!stats.isDirectory()) {
      const fileSize = stats.size;
      console.log(`${fileName} - ${fileExt} - ${Math.round(fileSize / 1024)}kb`);
    }
  });
};

const getFiles = (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(getStatsFile);
};

fs.readdir(filePath, getFiles);