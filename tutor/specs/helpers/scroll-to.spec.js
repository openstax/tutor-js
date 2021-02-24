import { deferred } from './index';
import Scroller from '../../src/helpers/scroll-to';

jest.useFakeTimers();

const HTML = `\
<div id='ox-react-root-container'>
  <h1>heading</h1>
  <p class="para">
    first paragraph.
  </p>
  <div class="wfig">
    <figure>a figure</figure>
  </div>
  <div id="tutor-boostrap-data">
    {"user":{"name":"Atticus Finch"}}
  </div>
  <img id="one" /><img id="two" />
</div>\
`;
describe('DOM Helpers', function() {
    let scroller;
    let root;
    beforeEach(function() {
        document.body.innerHTML = HTML;
        root = document.body.querySelector('#ox-react-root-container');
        scroller = new Scroller({ windowImpl: window });
        window.scroll = jest.fn();
    });

    it('scrolls to top', () => {
        scroller.scrollToTop();
        jest.runAllTimers();
        expect(window.scroll).toHaveBeenCalled();
    });

    it('can defer a scroll', () => {
        scroller.scrollToSelector('.wfig', { deferred: true });
        expect(window.scroll).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(window.scroll).toHaveBeenCalled();
    });

    it('can wait for images', () => {
        const imgs = Array.from(root.querySelectorAll('img'));
        expect(imgs).toHaveLength(2);
        imgs.forEach(img => img.addEventListener = jest.fn());
        scroller.scrollToSelector('.wfig', { afterImagesLoaded: true });
        expect(window.scroll).not.toHaveBeenCalled();
        imgs.forEach(img => {
            expect(img.addEventListener).toHaveBeenCalledWith('load', expect.any(Function), false);
            img.addEventListener.mock.calls[0][1]();
        });
        jest.runAllTimers();
        return deferred(() => {
            expect(window.scroll).toHaveBeenCalled();
        });
    });

});
