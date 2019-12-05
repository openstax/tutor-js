import BookTitle from '../../../src/screens/reference-book/book-title';

describe('Book Title Component', () => {
  let props;

  beforeEach(() => {
    props = {
      ux: {
        book: {
          title: 'A Grand Title',
        },
      },
    };
  });

  it('renders title', () => {
    const t = mount(<BookTitle {...props} />);
    expect(t.text()).toContain(props.ux.book.title);
    t.unmount();
  });

  it('renders and matches snapshot', () => {
    expect(<BookTitle {...props} />).toMatchSnapshot();
  });

});
