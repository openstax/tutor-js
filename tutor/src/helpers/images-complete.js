export default function imagesComplete(body) {

  return new Promise((resolve) => {
    const images = body.querySelectorAll('img');
    let complete = 0;
    const markComplete = () => {
      complete += 1;
      if (complete === images.length) {
        return resolve(images);
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
