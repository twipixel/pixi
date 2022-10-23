const fs = require('fs');
const path = require('path');

const getExamples = (dirPath, examples = {}, files = [], depth = 0) => {
  const readFiles = fs.readdirSync(dirPath);

  readFiles.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      examples[file] = {};
      getExamples(dirPath + '/' + file, examples[file], files, depth + 1);
    } else {
      if (path.extname(file).toLowerCase() === '.html' && !(depth === 0 && file.toLowerCase().indexOf('index') !== -1)) {
        const filePath = path.join(__dirname, dirPath, '/', file).replace(__dirname, '');
        files.push(filePath);
        examples[file] = filePath;
      }
    }
  })
  return { examples, files }
}

const { examples, files } = getExamples('./examples');
fs.writeFile(
  './examples/examples.js',
  `export const examples = ${JSON.stringify(examples, null, 2)};
  export const files = ${JSON.stringify(files, null, 2)};`,
  { flags: 'wx', encoding: 'utf8' },
  (err) => console.log(err ? err.toString() : 'create examples complete')
);