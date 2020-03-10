import TemplateModal from '../../src/components/template-modal';

describe('Template Modal', () => {

  it('renders and matches snapshot', () => {
    expect.snapshot(<TemplateModal templateType="neutral" />).toMatchSnapshot();
  });

});
