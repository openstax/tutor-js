import { React, PropTypes, observer, styled } from '../../../helpers/react';
import ContentLoader from 'react-content-loader';
import UX from '../ux';
import { StepCard } from './card';
import { ArbitraryHtmlAndMath } from 'shared';
import ContinueBtn from './continue-btn';
import Step from '../../../models/student-tasks/step';
import Badges from 'shared/components/exercise-badges';

const HtmlContent = styled(StepCard)`
iframe {
  max-width: 100%;
}
`;

const Loader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
    <rect x="0" y="70" rx="5" ry="5" width="400" height="400" />
  </ContentLoader>
);

export default
@observer
class HtmlContentTaskStep extends React.Component {

  static Loader = Loader;

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
  }

  render() {
    const { ux, step } = this.props;

    return (
      <HtmlContent unpadded className={`${step.type}-step`}>
        <Badges
          video={step.isVideo}
          interactive={step.isInteractive}
        />
        <ArbitraryHtmlAndMath html={step.content.html} />
        <ContinueBtn ux={ux} />
      </HtmlContent>
    );
  }
}
