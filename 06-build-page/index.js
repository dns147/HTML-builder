const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dirPath = path.join(__dirname, 'project-dist');
const dirAssetsDestPath = path.join(__dirname, 'project-dist', 'assets');
const dirAssetsSrcPath = path.join(__dirname, 'assets');
const dirComponentsPath = path.join(__dirname, 'components');
const fileTemplatePath = path.join(__dirname, 'template.html');
const reg = /(?<=\{\{).*(?=\}\})/g;
let content = {};

//--- Обработка ошибки ---
const eventError = err => {
  if (err) {
    throw err;
  }
};

//--- Проверка наличия дирректория ---
fs.stat(dirPath, (err) => {
  if (err) {
    makeDir(dirPath);
    makeDir(dirAssetsDestPath);
    fillContent();
    makeStyleCss();
    copyDir(dirAssetsSrcPath);
  } else {
    fillContent();
    makeStyleCss();
    copyDir(dirAssetsSrcPath);
  }
});

//--- Создание дирректории ---
function makeDir(path) {
  fs.mkdir(path, eventError);
}

//--- Заполнение объекта content данными из файлов компонентов ---
function fillContent() {
  fs.readdir(dirComponentsPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => {
      const fileName = path.parse(file).name;
      const currentPath = path.join(dirComponentsPath, `${fileName}.html`);
      const streamCurrent = fs.createReadStream(currentPath);

      streamCurrent.on('data', data => {
        const dataHeader = Buffer.from(data).toString();
        content[fileName] = dataHeader;
        readStreamLineByLine(fileTemplatePath);
      });
    });
  });
}

//--- Заполнение файла index.html данными из объекта content ---
function readStreamLineByLine(pth) {
  const fileHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
  const writeableStreamHtml = fs.createWriteStream(fileHtmlPath);
  const fileStream = fs.createReadStream(pth);
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on('line', line => {
    const tag = line.match(reg);

    if (!tag) {
      writeableStreamHtml.write(line + '\n');
    } else {
      for (let key in content) {
        if (tag[0] === key) {
          writeableStreamHtml.write(content[key] + '\n');
        }
      }
    }
  });
}

//--- Создание файла стилей ---
function makeStyleCss() {
  const fileCssPath = path.join(__dirname, 'project-dist', 'style.css');
  const writeableStreamCss = fs.createWriteStream(fileCssPath);
  const dirCssPath = path.join(__dirname, 'styles');

  fs.readdir(dirCssPath, (err, files) => {
    if (err) {
      throw err;
    }
  
    files.forEach(file => {
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
            writeableStreamCss.write(dataFile.toString() + '\n');
          })
        }
      });
    });
  });
}

//--- Копирование дирректории assets ---
function copyDir(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => {
      const fileSrcPath = path.join(dirPath, file);
      const fileDestPath = path.join(dirAssetsDestPath, file);
    
      fs.stat(fileDestPath, err => {
        if (err) {
          makeDir(fileDestPath);
        }
      });
    
      fs.stat(fileSrcPath, (err, stats) => {
        if (err) {
          throw err;
        } else {
          if (stats.isDirectory()) {
            copyDirDir(fileSrcPath);
          } else {
            fs.copyFile(fileSrcPath, fileDestPath, eventError);
          }
        }
      });
    });
  });
}

//--- Копирование вложенных в assets дирректорий ---
function copyDirDir(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach(file => {
      const fileName = path.parse(dirPath).name;
      const fileSrcPath = path.join(dirPath, file);
      const fileDestPath = path.join(dirAssetsDestPath, fileName, file);

      fs.copyFile(fileSrcPath, fileDestPath, eventError);
    });
  });
}