const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      let result = file.name.split('.').join(' - ');
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        if (err) throw err;
        result += ` - ${stats.size}b`;
        console.log(result);
      });
    }
  });
});