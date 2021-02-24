import HtmlVideo from 'helpers/html-videos';

describe('Html Video Helper', function() {
    it('can wrap an html video frame in a div', function() {
        let dom = document.createElement('div');
        const html = `<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`;

        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        return expect(dom.getElementsByClassName('embed-responsive').length).toEqual(1);
    });

    it('can wrap multiple html videos frame each in a div', function() {
        let dom = document.createElement('div');
        const html = `<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`;

        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        return expect(dom.getElementsByClassName('embed-responsive').length).toEqual(2);
    });

    it('can will not wrap frames if a wrapper already exists', function() {
        let dom = document.createElement('div');
        const html = `<div class="frame-wrapper embed-responsive">
<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe></div>`;

        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        return expect(dom.getElementsByClassName('embed-responsive').length).toEqual(1);
    });

    it('can wrap html videos frame even if nested', function() {
        let dom = document.createElement('div');
        const html = `<div><div><iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe></div></div>
<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`;

        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        return expect(dom.getElementsByClassName('embed-responsive').length).toEqual(2);
    });

    return it('can add responsive embed classes with correct aspect ratio', function() {
        let dom = document.createElement('div');

        let html = `<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`;
        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        expect(dom.getElementsByClassName('embed-responsive-16by9').length).toEqual(1);

        html = `<iframe width="560" height="420" src="https://www.youtube.com/embed/BINK6r1Wy78"
frameborder="0" allowfullscreen></iframe>`;
        dom.innerHTML = html;
        dom = HtmlVideo.wrapFrames(dom);
        return expect(dom.getElementsByClassName('embed-responsive-4by3').length).toEqual(1);
    });
});
