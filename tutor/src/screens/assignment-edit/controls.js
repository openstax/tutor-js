import { React, PropTypes, styled, observer } from 'vendor';
import { colors } from 'theme';
import { Button } from 'react-bootstrap';

const Footer = styled.div`
  position: fixed;
  z-index: 1030;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: .8rem 2.4rem;
  background: ${colors.neutral.bright};
  box-shadow: 0 -1px 2px rgba(0,0,0,0.19);

  .btn, .btn.btn-plain {
    padding: 0.6rem 2rem;
  }
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
`;

const Middle = styled.div`
  flex: 1;
`;

const LeftButton = styled(Button).attrs({
  variant: 'plain',
})`
  &.btn.btn-plain {
    background: #fff;
    color: ${colors.neutral.dark};
    border: 1px solid ${colors.neutral.pale};
    min-width: 10rem;
  }
`;

const RightButton = styled(Button)`
  min-width: 16rem;
`;


const Controls = observer(({ middleControls, ux: {
  onPublishClick, onSaveAsDraftClick, onCancel, steps: {
    isFirst, isLast, goForward, goBackward, canGoForward, canSubmit,
  } } }) => {

  let rightButtons = [];

  if (isLast) {
    rightButtons = [
      <RightButton key="draft" variant="secondary" onClick={onSaveAsDraftClick}>Save as Draft</RightButton>,
      <RightButton key="publish" variant="primary" disabled={!canSubmit} onClick={onPublishClick}>Publish</RightButton>,
    ];
  } else {
    rightButtons = [
      <RightButton key="forward" variant="primary" disabled={!canGoForward} onClick={goForward}>Save & Continue</RightButton>,
    ];
  }

  return (
    <Footer className="controls">
      <FooterInner>
        <LeftButton onClick={isFirst ? onCancel : goBackward}>
          {isFirst ? 'Cancel' : 'Back'}
        </LeftButton>
        <Middle>
          {middleControls}
        </Middle>
        {rightButtons}
      </FooterInner>
    </Footer>
  );
});

Controls.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Controls;
