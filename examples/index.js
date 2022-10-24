import {files} from './examples.js';

const container = document.getElementById('container');

const subExampleSeperator = '>';
for (let i = 0; i < files.length; i+=1) {
  const url = files[i];
  const paths = url.split('/');
  let [category, example, subExample] = paths.filter(path => path && path !== 'examples');

  const title = (() => {
    example = example.toLowerCase();
    example = example.replaceAll('-', ' ');
    const htmlIndex = example.indexOf('.html');

    // 카테고리에 바로 예제가 있는 경우
    if (htmlIndex !== -1) return example.substring(0, htmlIndex);

    subExample = subExample.toLowerCase();
    // 예제 안에 예제가 없는 경우
    if (subExample.includes('.html')) return example;

    // 예제 안에 보조 예제가 있는 경우
    return `${example} ${subExampleSeperator} ${subExample.replaceAll('-', ' ')}`
  })();

  const item = document.createElement('a');
  item.href = url;
  item.target = '_blank';
  const titleField = document.createElement('p');
  const categoryField = document.createElement('p');
  item.appendChild(titleField);
  item.appendChild(categoryField);
  container.appendChild(item);


  categoryField.innerText = category;
  titleField.innerText = title;
}