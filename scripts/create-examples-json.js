const fs = require('fs');
const path = require('path');

const getExamples = (dirPath, examples = {}, files = []) => {
  const readFiles = fs.readdirSync(dirPath);

  readFiles.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      examples[file] = {};
      getExamples(dirPath + '/' + file, examples[file], files);
    } else {
      if (path.extname(file).toLowerCase() === '.html') {
        const filePath = path.join(__dirname, dirPath, '/', file);
        files.push(filePath);
        examples[file] = filePath;
      }
    }
  })

  return { examples, files }
}

const json = getExamples('./examples');
const jsonString = JSON.stringify(json, null, 2);
console.log(jsonString);
fs.writeFile(
  './examples/examples.json',
  jsonString,
  { flags: 'wx', encoding: 'utf8' },
  (err) => console.log(err ? err.toString() : 'create examples complete')
);