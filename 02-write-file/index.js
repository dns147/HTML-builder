const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const filePath = path.join(__dirname, 'text.txt');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter yuor feedback: '
});

rl.prompt();

const eventError = err => {
  if (err) {
    throw err;
  }
};

const eventExit = line => {
  if (line === 'exit') {
    console.log('Thank you for your opinion!');
    process.exit(0);
  }

  fs.appendFile(filePath, line + '\n', eventError);
  rl.prompt();
};

const eventSigint = () => {
  console.log('\nThank you for your opinion!');
  process.exit(0);
};

fs.open(filePath, 'w', eventError);

rl.on('line', eventExit)
  .on('SIGINT', eventSigint);