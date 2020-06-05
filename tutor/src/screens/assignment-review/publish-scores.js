import { React, PropTypes, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AsyncButton } from 'shared';

const PublishScores = observer(({ ux }) => {
  if ((ux.scores.hasFinishedGrading && ux.scores.hasUnPublishedScore) || ux.planScores.isManualGradingGrade) { 
    return null;
  }

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip>
          {ux.hasUnPublishedScores ?
            'Publish to make scores available to students' :
            'All scores have already been published'
          }
        </Tooltip>
      }
    >
      <AsyncButton
        variant="primary"
        className="btn-standard"
        isWaiting={ux.isPublishingScores}
        isDisabled={!ux.hasUnPublishedScores}
        waitingText="Publishing…"
        onClick={ux.onPublishScores}
        data-test-id="publish-scores"
      >
        Publish scores
      </AsyncButton>
    </OverlayTrigger>
  );
});
PublishScores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default PublishScores;
