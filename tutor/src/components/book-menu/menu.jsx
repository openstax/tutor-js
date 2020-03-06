import { React, cn, PropTypes, styled, observer, useObserver } from 'vendor';
import { Icon } from 'shared';
import { map, isEmpty } from 'lodash';
import TutorLink from '../link';
import ChapterSection from '../chapter-section';
import ReferenceBook from '../../models/reference-book';
import ReferenceBookNode from '../../models/reference-book/node';
import MenuUX from './ux';
import Theme from '../../theme';
import BookPartTitle from '../book-part-title';

const StyledTitle = styled.div`
  display: flex;
  line-height: 2.3rem;
  color: ${Theme.colors.neutral.dark};
`;

const Title = ({ node, pageLinkProps }) => {
  return useObserver(() => {
    const title =  (
      <StyledTitle>
        <ChapterSection chapterSection={node.chapter_section} />
        <BookPartTitle title={node.title} />
      </StyledTitle>
    );

    if (!node.hasContent) { return title; }

    return (
      <TutorLink
        {...pageLinkProps(node)}
      >
        {title}
      </TutorLink>
    );
  });
};

Title.propTypes = {
  pageLinkProps: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
};


const BranchIcon = styled(Icon)`
  margin-top: 4px;
  align-self: flex-start;
  transform: rotate(0deg);
  transition: transform 0.2s;
  &.expanded {
    transform: rotate(90deg);
  }
`;

const Ol = styled.ol`
  list-style-type: none;
  padding: 0 1rem;
`;

const Li = styled.li`
  list-style-type: none;
  margin: 1rem 0.5rem 0 0;
  &.active {
    font-weight: bolder;
  }
`;

const Details = styled.details`
  ol {
    margin-left: 2rem;
    padding-left: 0;
  }
`;

const Summary = styled.summary`
  cursor: pointer;
  list-style: none;
  ::before {
    display: none;
  }
  ::-moz-list-bullet {
    list-style-type: none;
  }
  ::-webkit-details-marker {
    display:none;
  }
  > div {
    display: flex;
    align-items: baseline;
  }
`;

const Branch = ({ node, depth, ux, ...props }) => {
  return useObserver(() => {
    const isExpanded = ux.isExpanded(node);
    return (
      <Ol
        className="section"
        data-depth={node.depth}
      >
        <Li>
          <Details
            open={isExpanded}
            data-node-id={node.pathId}
          >
            <Summary onClick={(ev) => ux.toggleExpansion(node, ev)}>
              <div>
                <BranchIcon type="caret-right" className={cn({ expanded: isExpanded })} />
                <Title {...props} node={node} />
              </div>
            </Summary>
            <Ol>
              {map(node.children, (child, i) => (
                <Node key={i} {...props} depth={depth+1} ux={ux} node={child} />
              ))}
            </Ol>
          </Details>
        </Li>
      </Ol>
    );
  });
};
Branch.propTypes = {
  ux: PropTypes.instanceOf(MenuUX).isRequired,
  pageLinkProps: PropTypes.func.isRequired,
  depth: PropTypes.number.isRequired,
  node: PropTypes.object,
};


const Leaf = ({ node, ux, depth, ...props }) => {
  const title = <Title {...props} node={node} />;
  if (0 == depth) {
    return title;
  }
  return useObserver(() => (
    <Li data-node-id={node.pathId} className={cn({ active: ux.currentPage == node })}>
      {title}
    </Li>
  ));
};

Leaf.propTypes = {
  pageLinkProps: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  ux: PropTypes.instanceOf(MenuUX).isRequired,
};


const Node = ({ node, ...props }) => {
  const Component = isEmpty(node.children) ? Leaf : Branch;
  return <Component {...props} node={node} />;
};

Node.propTypes = {
  node: PropTypes.object,
};

const StyledMenu = styled.div`
  width: ${Theme.sizes.bookTocWidth};
  position: fixed;
  top: 60px;
  left: 0;
  background: white;
  margin-left: -${Theme.sizes.bookTocWidth};
  padding-top: 1.5rem;
  bottom: 0;
  z-index: 3;  // on top of book elements (booksplash, forward/prev controls)
  max-height: 100%;
  overflow-y: scroll;
  &.open {
    margin-left: 0;
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    &.ontop {
      z-index: 1130;
      box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
    }
  }
  .chapter-section {
    margin-right: 0.4rem;
  }
  > a {
    display: flex;
    padding: 1rem 0 0 1rem;
  }
  > ol + a {
    padding-top: 0;
  }
`;

export default
@observer
class BookMenu extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(MenuUX),
    className: PropTypes.string,
    currentPage: PropTypes.instanceOf(ReferenceBookNode),
    pageLinkProps: PropTypes.func.isRequired,
    book: PropTypes.instanceOf(ReferenceBook).isRequired,
  }

  ux = this.props.ux || new MenuUX(this.props)

  menuWrapper = React.createRef()

  componentDidMount() {
    this.ux.wrapper = this.menuWrapper.current;
  }

  componentDidUpdate() {
    this.ux.currentPage = this.props.currentPage;
  }

  render() {
    const { book, className, pageLinkProps } = this.props;

    return (
      <StyledMenu ref={this.menuWrapper} className={cn('book-menu', className )}>
        {map(book.children, (child, i) => (
          <Node
            ux={this.ux}
            node={child}
            key={i}
            depth={0}
            pageLinkProps={pageLinkProps}
          />
        ))}
      </StyledMenu>
    );
  }

}
