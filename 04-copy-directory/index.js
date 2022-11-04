const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

const eventError = err => {
  if (err) {
    throw err;
  }
};

const copyFiles = file => {
  const fileSrcPath = path.join(dirPath, file);
  const fileDestPath = path.join(dirCopyPath, file);

  fs.copyFile(fileSrcPath, fileDestPath, eventError);
};

fs.mkdir(dirCopyPath, err => {
  if (err) {
    fs.rm(dirCopyPath, { recursive: true }, eventError);
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        throw err;
      }

      files.forEach(copyFiles);
    });
  }
});

fs.rm(dirCopyPath, { recursive: true }, err => {
  if (!err) {
    fs.mkdir(dirCopyPath, eventError);
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        throw err;
      }

      files.forEach(copyFiles);
    });
  }
});