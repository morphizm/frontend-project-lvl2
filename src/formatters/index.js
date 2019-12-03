import renderPlain from './plain';
import renderJson from './json';
import render from './text';

const getRender = (format) => {
  if (format === 'json') {
    return (data) => JSON.stringify(renderJson(data));
  }
  if (format === 'plain') {
    return renderPlain;
  }
  return render;
};

export default getRender;
