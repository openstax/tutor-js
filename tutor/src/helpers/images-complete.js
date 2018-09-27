import { isFunction } from 'lodash';

export default function imagesComplete({
  body = document.body,
  timeoutAfter = 10000, // in ms, 10 seconds
} = {}) {
  return new Promise((resolve, reject) => {
    if (!body || !isFunction(body.querySelectorAll)) {
      resolve([]);
      return;
    }

    const images = Array.from(body.querySelectorAll('img'));
    if (0 === images.length) {
      resolve(images);
      return;
    }
    let complete = 0;
    let pendingTimeout = setTimeout(() => {
      pendingTimeout = null;
      reject(images);
    }, timeoutAfter);
    const markComplete = () => {
      complete += 1;
      if (complete === images.length) {
        if (pendingTimeout) {
          clearInterval(pendingTimeout);
          pendingTimeout = null;
        }
        resolve(images);
      }
    };
    images.forEach((img) => {
      if (img.naturalWidth) {
        markComplete();
      } else {
        img.addEventListener( 'load', markComplete, false );
        img.addEventListener( 'error', markComplete, false );
      }
    });
  });

}
