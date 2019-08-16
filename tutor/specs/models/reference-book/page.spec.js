import Factory from '../../factories';

describe('Reference Book Page', () => {
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

});
