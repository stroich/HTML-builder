const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
});
console.log('Пожалуйста, введите данные');
rl.on('line', (input) => {
  if (input.toString() === 'exit') {
    console.log('Cпасибо за информацию');
    rl.close();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${input}\n`,
      (err) => {
        if (err) throw err;
      },
    );
  }
});
rl.on('SIGINT', () => {
  console.log('Cпасибо за информацию');
  rl.close();
});




