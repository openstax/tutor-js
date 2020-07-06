import { React, PropTypes, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AsyncButton } from 'shared';

const PublishScores = observer(({ ux, variant = 'primary' }) => {
  if (!ux.hasUnPublishedScores) {
    return null;
  }

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip>
            Publish to make scores available to students
        </Tooltip>
      }
    >
      <AsyncButton
        variant={variant}
        className="btn-standard"
        isWaiting={ux.isPublishingScores}
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
  variant: PropTypes.string,
  ux: PropTypes.shape({
    hasUnPublishedScores: PropTypes.bool.isRequired,
    isPublishingScores: PropTypes.bool.isRequired,
    onPublishScores: PropTypes.func.isRequired,
  }).isRequired,
};

export default PublishScores;
