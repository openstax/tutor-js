import ContentPage from '../../src/components/content-page';

describe('Content Page', () => {

  it('renders and matches snapshot', () => {
    expect.snapshot(<ContentPage />).toMatchSnapshot();
  });
});
