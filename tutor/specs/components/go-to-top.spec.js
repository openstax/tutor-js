import GoToTop from '../../src/components/go-to-top';

describe('GoToTop', () => {
  it('matches snapshot', () => {
    expect.snapshot(<GoToTop />).toMatchSnapshot();
  });
});
