import renderPlain from './plain';
import renderJson from './json';
import render from './text';

const getRender = (format) => {
  switch (format) {
    case 'json':
      return renderJson;
    case 'plain':
      return renderPlain;
    default:
      return render;
  }
};

export default getRender;
