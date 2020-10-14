import { React, withRouter, observer, PropTypes } from 'vendor';
import { ScrollToTop } from 'shared';
import Loading from 'shared/components/loading-animation';
import Router from '../../helpers/router';
import Header from '../../components/header';
import UX from './ux';
import PracticeQuestionsEmptyList from './empty-list';
import PracticeQuestionsList from './list';

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

  componentWillUnmount() {
    this.ux.clear();
  }

  renderComponent(ux) {
    if(ux.isInitializing) {
      return <Loading message="Loading your practice questions…" />;
    }
    if (ux.isPracticeQuestionsEmpty) {
      return <PracticeQuestionsEmptyList />;
    }
    return <PracticeQuestionsList ux={ux} />;
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
        {
          this.renderComponent(ux)
        }
      </ScrollToTop>
    );

  }
}


export default PracticeQuestions;
