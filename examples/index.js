import {files} from './examples.js';

let stageWidth = 0, items = [];

const itemWidth = 180;
const itemHeight = 111;
const itemRatio = 0.616666667;
const container = document.getElementById('container');
const gradientColor = ['#1c1b4d', '#b80e65', '#1791b1'];
const cyberpunkColor = ['#00f0ff', '#04CDEB', '#FF003C', '#F20371', '#FB30E0', '#EA00D9', '#770DFF'];

const shuffle = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
}

const debounce = (callback, limit = 100) => {
  let timeout
  return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
          callback.apply(this, args)
      }, limit)
  }
}

const randomString = (num) => {
  let result = '';
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+~';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const motionText = (text, t) => {
  const length = text.length;
  const index = Math.floor(t * length);
  const rest = length - index;
  return `${text.substring(0, index)}${randomString(rest)}`;
}

const createExamples = (items = []) => {
  const tagColor = {};
  const categoryColor = cyberpunkColor.slice();

  for (let i = 0; i < files.length; i+=1) {
    const url = files[i];
    const paths = url.split('/');
    let [category, example, subExample = ''] = paths.filter(path => path && path !== 'examples');
    category = category.toUpperCase();

    if (!tagColor[category]) {
      const randomColor = shuffle(categoryColor)[0];
      tagColor[category] = randomColor;
      categoryColor.splice(categoryColor.indexOf(randomColor), 1);
    }

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
    item.style.width = `${itemWidth}px`;
    item.style.height = `${itemHeight}px`;
    item.style.border = 'solid #04080B 1px';
    item.style.overflow = 'hidden';
    item.style.position = 'relative';
    item.style.background = '#fcee09';
    item.style.transform = 'scale(1.0)';
    item.style.transition = '0.3s transform';

    const titleArea = document.createElement('div');
    titleArea.style.margin = '24px 0px 0px 26px';
    titleArea.style.padding = '0px 26px 0px 0px';
    titleArea.style.transform = 'translate(0px, 0px)';
    titleArea.style.transition = '0.8s transform';
    item.appendChild(titleArea);

    const mainField = document.createElement('p');
    // mainField.style.border = 'solid';
    mainField.style.fontSize = '16px';
    mainField.style.color = '#000000';
    mainField.style.overflowWrap = 'break-word';
    mainField.innerText = title;
    titleArea.appendChild(mainField);

    if (subTitle) {
      const subField = document.createElement('p');
      subField.style.width = 'max-content';
      subField.style.fontSize = '11px';
      subField.style.padding = '0px 2px 0px 2px';
      subField.style.margin = '-14px 0px 0px 0px';
      subField.style.background = '#000000';
      subField.style.color = '#fcee09';
      subField.innerText = subTitle;
      titleArea.appendChild(subField);
    }

    const tagArea = document.createElement('div');
    tagArea.id = 'tagArea';
    tagArea.style.position = 'absolute';
    tagArea.style.right = '26px';
    tagArea.style.bottom = '8px';
    tagArea.style.transform = 'translate(0px, 0px)';
    tagArea.style.transition = '0.8s transform';
    item.appendChild(tagArea);

    const tagField = document.createElement('p');
    tagField.style.float = 'left';
    tagField.style.width = 'max-content';
    tagField.style.fontSize = '12px';
    tagField.style.padding = `0px 0px 0px 0px`;
    tagField.style.color = '#fff';
    tagField.style.background = tagColor[category];
    tagField.innerText = category;
    tagArea.appendChild(tagField);

    // const diagonalFront = document.createElement('p');
    // diagonalFront.style.opacity = 0.5;
    // diagonalFront.style.border = 'solid red 1px';
    // diagonalFront.style.float = 'left';
    // diagonalFront.style.color = '#fcee09';
    // diagonalFront.style.background = '#fcee09';
    // diagonalFront.style.width = 'max-content';
    // diagonalFront.style.fontSize = '14px';
    // diagonalFront.style.transform = 'translate(4px, -6px) scale(1.3) rotate(35deg)';
    // diagonalFront.innerText = 'O';
    // tagArea.appendChild(diagonalFront);

    // const diagonalBack = document.createElement('p');
    // diagonalBack.style.opacity = 0.5;
    // diagonalBack.style.border = 'solid red 1px';
    // diagonalBack.style.float = 'left';
    // diagonalBack.style.color = '#fcee09';
    // diagonalBack.style.background = '#fcee09';
    // diagonalBack.style.width = 'max-content';
    // diagonalBack.style.fontSize = '14px';
    // diagonalBack.style.transform = 'translate(-5px, 0px) scale(1.3) rotate(35deg)';
    // diagonalBack.innerText = 'O';
    // tagArea.appendChild(diagonalBack);

    item.addEventListener('mouseenter', () => {
      item.style.zIndex = 1;
      item.style.transform = 'scale(1.06)';

      const randomGradient = shuffle(gradientColor).join(',');
      const randomDegree = Math.floor(Math.random() * 360);
      item.style.background = `linear-gradient(${randomDegree}deg, ${randomGradient})`;
      item.style.backgroundSize = '400% 400%';
      item.style.animation = 'gradient 15s ease infinite';
      item.style.boxShadow = `10px 10px 54px -6px rgba(0,0,0,0.75)`;
      mainField.style.color = '#fcee09';
      // diagonalFront.style.display = 'none';
      // diagonalBack.style.display = 'none';
      const mainTextMotion = Be.tween(item, {easing: 1}, {easing: 0}, 0.5, Back.easeIn);
      mainTextMotion.onUpdate = () => {
        const { target, isPlaying } = mainTextMotion;
        const { easing } = target;
        if (!isPlaying) {
          const titleAreaHeight = titleArea.offsetHeight;
          const fontSize = mainField.style.fontSize;
          const lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5);
          const lines = Math.floor(titleAreaHeight / lineHeight);
          const maxTitle = lines >= 3 || lines >= 2 && subTitle;
          const titleX = maxTitle ? -4 : 8;
          const titleY = maxTitle ? -4 : 8;
          const tagX = maxTitle ? 4 : -16;
          const tagY = maxTitle ? 4 : -8;

          titleArea.style.padding = '0px 46px 0px 0px';
          titleArea.style.transform = `translate(${titleX}px, ${titleY}px)`;
          tagArea.style.transform = `translate(${tagX}px, ${tagY}px)`;
        }
        mainField.innerText = motionText(title, easing);
      };

      const subTextMotion = Be.tween(tagField, {easing: 1}, {easing: 0}, 0.5, Back.easeIn);

      subTextMotion.onUpdate = () => {
        const { target } = subTextMotion;
        const { easing } = target;
        tagField.innerText = motionText(category, easing);
      };

      const serial = Be.serial(mainTextMotion, subTextMotion);
      serial.play();

      const leaveListener = () => {
        serial.stop();
        item.id = 'item';
        item.style.zIndex = 0;
        item.style.transform = 'scale(1.0)';
        item.style.background = '#fcee09';
        item.style.animation = '';
        item.style.boxShadow = '';
        mainField.style.color = '#000000';
        mainField.style.textShadow = '';
        mainField.innerText = title;
        tagField.innerText = category;
        titleArea.style.padding = '0px 26px 0px 0px';
        titleArea.style.transform = 'translate(0px, 0px)';
        tagArea.style.transform = 'translate(0px, 0px)';
        item.removeEventListener('mouseleave', leaveListener);
        // diagonalFront.style.display = '';
        // diagonalBack.style.display = '';
      }

      item.addEventListener('mouseleave', leaveListener);
    });

    container.appendChild(item);
    items.push(item);
  }
  return items;
}

const resize = (items) => {
  stageWidth = document.body.clientWidth;
  const colums = Math.floor(stageWidth / itemWidth);
  const rest = stageWidth - itemWidth * colums;
  const some = Math.floor(rest / colums);
  const width = itemWidth + some;
  container.style.gridTemplateColumns = `repeat(${colums}, 0fr)`;
  items.forEach(item => {
    item.style.width = `${width}px`;
    item.style.height = `${width * itemRatio}px`;
  });
};

window.onload = () => {
  items = createExamples();
  resize(items);
}

window.onresize = debounce(() => {
  resize(items);
}, 300);


