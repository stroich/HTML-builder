const fs = require('fs');
const fsPromises = require('node:fs/promises');
const { join } = require('node:path');
const { mkdir } = require('node:fs/promises');
const path = require('path');
const readline = require('readline');

function createDirectory() {
  const projectFolder = join(__dirname, 'project-dist');
  mkdir(projectFolder, { recursive: true });
}
createDirectory();

function createCss() {
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
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'style.css'),
    '',
    (err) => {
      if (err) throw err;
    },
  );
  async function writeFile(file) {
    const arr = await fileToArray(file);
    fs.appendFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      arr.join('\n'),
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
}
createCss();

function createAssets() {
  function copyDir(projectFolder, projectFolderCopy) {
    async function deleteFiles() {
      await fsPromises.rm(projectFolderCopy, {
        recursive: true,
        force: true,
        maxRetries: 100,
      });
      mkdir(projectFolderCopy, { recursive: true });
      copyFiles();
    }
    function copyFiles() {
      fs.readdir(projectFolder, { withFileTypes: true }, (error, files) => {
        files.forEach((file) => {
          if (file.isFile()) {
            const projectFile = join(projectFolder, file.name);
            const projectFileCopy = join(projectFolderCopy, file.name);
            fs.promises.copyFile(projectFile, projectFileCopy);
          } else if (file.isDirectory()) {
            const directoryFile = join(projectFolder, file.name);
            const directoryFileCopy = join(projectFolderCopy, file.name);
            copyDir(directoryFile, directoryFileCopy);
          }
        });
        if (error) throw error;
      });
    }
    fs.access(projectFolderCopy, (err) => {
      if (err) {
        mkdir(projectFolderCopy, { recursive: true });
        copyFiles();
      } else {
        deleteFiles();
      }
    });
  }
  const projectFolder = join(__dirname, 'assets');
  const projectFolderCopy = join(__dirname, 'project-dist', 'assets');
  copyDir(projectFolder, projectFolderCopy);
}
createAssets();

function createHtml() {
  const indexPath = join(__dirname, 'project-dist', 'index.html');
  fs.writeFile(indexPath, '', (err) => { if (err) throw err; });
  const output = fs.createWriteStream(indexPath);

  async function readTemplate() {
    const filepath = join(__dirname, 'template.html');
    let templateContent = await fsPromises.readFile(filepath, {
      encoding: 'utf-8',
    });
    const templateContentArr = templateContent.match(/{{[a-z]*}}/gi);
    for (const line of templateContentArr) {
      component = String(line).split('').filter((el) => {
        const str = '{ }';
        if (!str.includes(el)) {
          return el;
        }
      }).join('');
      const pathFile = join(__dirname, 'components', `${component}.html`);
      const componentContent = await fsPromises.readFile(pathFile, {
        encoding: 'utf-8',
      });
      templateContent = templateContent.replace(line, componentContent);
    }
    output.write(templateContent);
  }
  readTemplate();
}
createHtml();
