import Factory from '../../factories';

describe('Reference Book Node', () => {
    let page;
    beforeEach(() => {
        page = Factory.page();
    });

    it('#isAssignable', () => {
        expect(page.isAssignable).toBe(true);
        page.title = 'Key Terms';
        expect(page.isAssignable).toBe(false);
        page.title = 'Summary Of Things';
        expect(page.isAssignable).toBe(true);
        page.title = 'Chapter Summary';
        expect(page.isAssignable).toBe(false);
    });

    it('#titleText', () => {
        page.title = '<span><span class="os-number">4.6</span><span class="os-divider"> </span><span class="os-text">Chapter Summary</span></span>'
        expect(page.titleText).toEqual('Chapter Summary')
        expect(page.isAssignable).toBe(false)
        page.title = 'NO HTML HERE'
        expect(page.titleText).toEqual(page.title)
    })

});
