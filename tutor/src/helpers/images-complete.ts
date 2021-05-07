import { map, isFunction } from 'lodash';
import { Raven } from '../models'

export default function imagesComplete({
    body = document.body,
    timeoutAfter = 10000, // in ms, 10 seconds
} = {}) {
    return new Promise((resolve) => {
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
        let pendingTimeout: number|null = window.setTimeout(() => {
            pendingTimeout = null;
            resolve([]);
            Raven.log('Timed out loading images', {
                remaining: images.length - complete,
                images: map(images, 'src'),
            });
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
        const markFailure = (ev) => {
            markComplete();
            Raven.log('Failed to load image', {
                image: ev.target.src,
            });
        };
        images.forEach((img) => {
            if (img.naturalWidth) {
                markComplete();
            } else {
                img.addEventListener( 'load', markComplete, false );
                img.addEventListener( 'error', markFailure, false );
            }
        });
    });

}
