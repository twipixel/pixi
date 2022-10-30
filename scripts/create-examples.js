const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '..');

const getExamples = (dirPath, examples = {}, files = [], depth = 0) => {
  const readFiles = fs.readdirSync(dirPath);

  readFiles.forEach(file => {
    const filePath = path.resolve(dirPath, file);
    const state = fs.statSync(filePath);
    const lowerCaseFileName = file.toLowerCase();

    if (state.isDirectory()) {
      examples[file] = {};
      getExamples(dirPath + '/' + file, examples[file], files, depth + 1);
    } else {
      const extName = path.extname(lowerCaseFileName);
      if (extName === '.html' && !(depth === 0 && lowerCaseFileName.indexOf('index') !== -1)) {
        const name = file.replace(extName, '');
        const modifyTime = state.mtimeMs;
        const fileInfo = { path: filePath.replace(rootPath, ''), modifyTime };
        files.push(fileInfo);
        examples[name] = fileInfo;
      }
    }
  })
  return { examples, files }
}

const { examples, files } = getExamples('./examples');
const sorted = files.sort(({modifyTime: aModifyTime}, {modifyTime: bModifyTime}) => bModifyTime - aModifyTime);
const paths = sorted.map(file => file.path);

fs.writeFile(
  './examples/examples.js',
  `
  export const examples = ${JSON.stringify(examples, null, 2)};
  export const files = ${JSON.stringify(files, null, 2)};
  export const paths = ${JSON.stringify(paths, null, 2)};
  `,
  { flags: 'wx', encoding: 'utf8' },
  (err) => {
    console.log('examples', JSON.stringify(examples, null, 2));
    console.log('files', JSON.stringify(files, null, 2));
    console.log('paths', JSON.stringify(paths, null, 2));
    console.log(err ? err.toString() : 'CREATE EXAMPLES COMPLETE');
  }
);