import { React, withRouter, observer, PropTypes } from 'vendor';
import { ScrollToTop } from 'shared';
import Router from '../../helpers/router';
import Header from '../../components/header';
import UX from './ux';
import PracticeQuestionsEmptyList from './empty-list';

@withRouter
@observer
class PracticeQuestions extends React.Component {

  static displayName = 'PracticeQuestions';

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }),
  }

  constructor(props) {
    super(props);
    this.ux = new UX();
    this.ux.initialize({
      courseId: props.params.courseId,
    });
  }

  render() {
    const { ux } = this;
    return (
      <ScrollToTop>
        <Header
          unDocked={true}
          title="My Practice Questions"
          backTo={Router.makePathname('dashboard', { courseId: ux.course.id })}
          backToText='Dashboard'
        />
        <PracticeQuestionsEmptyList />
      </ScrollToTop>
    );

  }
}


export default PracticeQuestions;
