export default function imagesComplete({
  body = document,
  timeoutAfter = 10000, // in ms, 10 seconds
} = {}) {
  return new Promise((resolve) => {
    const images = body.querySelectorAll('img');
    let complete = 0;
    let pendingTimeout = setTimeout(() => {
      if (complete < images.length) {
        complete = images.length;
        pendingTimeout = null;
        resolve(images);
      }
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
    Array.from(images).forEach((img) => {
      if (img.naturalWidth) {
        markComplete();
      } else {
        img.addEventListener( 'load', markComplete, false );
        img.addEventListener( 'error', markComplete, false );
      }
    });
  });

}
