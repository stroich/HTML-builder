const fs = require('fs');
const { join } = require('node:path');
const path = require('path');
const readline = require('readline');

fs.writeFile(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  '',
  (err) => {
    if (err) throw err;
  },
);

async function fileToArray(file) {
  const filepath = join(__dirname, 'styles', file.name);
  const input = fs.createReadStream(filepath);
  const res = await new Promise((resolve, reject) => {
    const strings = [];
    const rl = readline.createInterface({
      input,
      crlfDelay: Infinity,
    });
    rl.on('line', (line) => strings.push(line));
    rl.once('close', () => resolve(strings));
    rl.once('error', (err) => reject(err));
  });
  return res;
}

async function writeFile(file) {
  const arr = await fileToArray(file);  
  fs.appendFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    arr.join('\n'),
    (err) => {
      if (err) throw err;
    },
  );
  fs.appendFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '\n',
    (err) => {
      if (err) throw err;
    },
  );
}

fs.readdir(join(__dirname, 'styles'), { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  files.forEach((file) => {
    const pathFile = join(__dirname, 'styles', file.name);
    const extname = path.extname(pathFile);
    if (extname === '.css' && file.isFile()) {
      writeFile(file);
    }
  });
});
