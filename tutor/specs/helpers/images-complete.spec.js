import imagesComplete from '../../src/helpers/images-complete';
import { JSDOM } from 'jsdom';
import { deferred } from './index';
import Raven from '../../src/models/app/raven';
jest.mock('../../src/models/app/raven');
jest.useFakeTimers();

describe('Images Complete Helper', () => {

  let body;

  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>' );
    body = dom.window.document.body;
  });

  it('resolves immediatly when no images are present', () => {
    return imagesComplete({ body }).then((images) => {
      expect(images).toHaveLength(0);
    });
  });

  it('times out when images never resolve', () => {
    body.innerHTML = '<img src="one" /><img src="two" />';
    const complete = imagesComplete({ body });
    jest.runAllTimers();
    return complete.then((images) => {
      expect(images).toHaveLength(0);
      expect(Raven.log).toHaveBeenCalledWith('Timed out loading images', {
        remaining: 2,
        images: ['one', 'two'],
      });
    });
  });

  it('resolves after images are loaded', () => {
    body.innerHTML = '<img id="one" /><img id="two" />';
    const imgs = Array.from(body.querySelectorAll('img'));
    imgs.forEach(img => img.addEventListener = jest.fn());
    const complete = jest.fn();
    const reject = jest.fn();
    imagesComplete({ body }).then(complete).catch(reject);
    imgs.forEach(img => {
      expect(img.addEventListener).toHaveBeenCalledWith('load', expect.any(Function), false);
      img.addEventListener.mock.calls[0][1]();
    });
    return deferred(() => {
      expect(complete).toHaveBeenCalledWith(expect.arrayContaining(imgs));
      expect(reject).not.toHaveBeenCalled();
    });
  });

});
