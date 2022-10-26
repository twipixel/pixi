import {files} from './examples.js';

const container = document.getElementById('container');

const createExamples = (examples = []) => {
  for (let i = 0; i < files.length; i+=1) {
    const url = files[i];
    const paths = url.split('/');
    let [category, example, subExample = ''] = paths.filter(path => path && path !== 'examples');

    const {title, subTitle} = (() => {
      example = example.toUpperCase().replaceAll(/-[A-Z0-9]|_[A-Z0-9]/g, (str) => ` ${str[1].toUpperCase()}`);

      const htmlIndex = example.indexOf('.HTML');

      // 카테고리에 바로 예제가 있는 경우
      if (htmlIndex !== -1) return {title: example.substring(0, htmlIndex), subTitle: ''};

      subExample = subExample.toUpperCase();

      // 예제 안에 예제가 없는 경우
      if (subExample.includes('.HTML')) return {title: example, subTitle: ''};

      // 예제 안에 보조 예제가 있는 경우
      return {title: example, subTitle: subExample.replaceAll('-', ' ').replaceAll('_', ' ')};
    })();

    const item = document.createElement('a');
    item.id = 'item';
    item.href = url;
    item.target = '_blank';
    item.style.width = '180px';
    item.style.height = '111px';
    item.style.border = 'solid #04080B 1px';
    item.style.overflow = 'hidden';
    item.style.position = 'relative';
    item.style.backgroundColor = '#fcee09';
    item.style.transform = 'scale(1.0)';
    item.style.transition = '0.15s transform';
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = 1;
      item.style.transform = 'scale(1.08'
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = 0;
      item.style.transform = 'scale(1.0'
    });

    const titleArea = document.createElement('div');
    titleArea.style.margin = '24px 0px 0px 26px';
    item.appendChild(titleArea);

    const mainField = document.createElement('p');
    mainField.style.padding = '0px 24px 0px 0px';
    mainField.style.fontSize = '16px';
    mainField.style.color = '#000000';
    mainField.innerText = title;
    titleArea.appendChild(mainField);

    if (subTitle) {
      const subField = document.createElement('p');
      subField.style.width = 'max-content';
      subField.style.fontSize = '11px';
      subField.style.padding = '0px 2px 0px 2px';
      subField.style.margin = '-14px 0px 0px 0px';
      subField.style.backgroundColor = '#000000';
      subField.style.color = '#fcee09';
      subField.innerText = subTitle;
      titleArea.appendChild(subField);
    }

    const tagArea = document.createElement('div');
    tagArea.style.position = 'absolute';
    tagArea.style.right = '14px';
    tagArea.style.bottom = '0px';
    item.appendChild(tagArea);

    const diagonalFront = document.createElement('p');
    // diagonalFront.style.opacity = 0.5;
    // diagonalFront.style.border = 'solid red 1px';
    diagonalFront.style.float = 'left';
    diagonalFront.style.backgroundColor = '#fcee09';
    diagonalFront.style.width = 'max-content';
    diagonalFront.style.fontSize = '14px';
    diagonalFront.style.color = '#fcee09';
    diagonalFront.style.transform = 'translate(4px, -6px) scale(1.3) rotate(35deg)';
    diagonalFront.innerText = 'O';
    tagArea.appendChild(diagonalFront);

    const tagField = document.createElement('p');
    tagField.style.float = 'left';
    tagField.style.width = 'max-content';
    tagField.style.color = '#390A54';
    tagField.style.fontSize = '12px';
    tagField.style.padding = '0px 12px 0px 12px';
    tagField.style.color = '#000000';
    tagField.style.backgroundColor = '#00f0ff';
    tagField.style.background = 'linear-gradient(-45deg, transparent 15px, palevioletred 0);';
    tagField.innerText = category.toUpperCase();
    tagArea.appendChild(tagField);

    const diagonalBack = document.createElement('p');
    // diagonalBack.style.opacity = 0.5;
    // diagonalBack.style.border = 'solid red 1px';
    diagonalBack.style.float = 'left';
    diagonalBack.style.backgroundColor = '#fcee09';
    diagonalBack.style.width = 'max-content';
    diagonalBack.style.fontSize = '14px';
    diagonalBack.style.color = '#fcee09';
    diagonalBack.style.transform = 'translate(-5px, 0px) scale(1.3) rotate(35deg)';
    diagonalBack.innerText = 'O';
    tagArea.appendChild(diagonalBack);

    container.appendChild(item);
    examples.push(item);
  }
  return examples;
}

const resize = (examples) => {

};

const examples = createExamples();


window.addEventListener('resize', () => {

});
