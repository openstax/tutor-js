import { JSDOM } from 'jsdom';

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
</div>\
`;
describe('DOM Helpers', function() {
  let scroller;
  let root;
  beforeEach(function() {
    root = document.createElement('div');
    root.innerHTML = HTML;
    document.body.append(root);
    scroller = new Scroller(window);
    window.scroll = jest.fn();
  });

  it('scrolls to top', () => {
    scroller.scrollToTop();
    jest.runAllTimers();
    expect(window.scroll).toHaveBeenCalledWith(0,0);
  });

  it('can defer a scroll', () => {
    scroller.scrollToSelector('.wfig', { deferred: true });
    expect(window.scroll).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(window.scroll).toHaveBeenCalledWith(0,0);
  });

});
