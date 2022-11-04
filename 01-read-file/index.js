const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath);

const dataStream = data => {
  const dataFile = Buffer.from(data);
  //process.stdout.write(dataFile); // 1-ый способ вывода
  console.log(dataFile.toString()); // 2-ой способ вывода
};

stream.on('data', dataStream);