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
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
`;

const Spacer = styled.div`
  flex: 1;
`;

const LeftButton = styled(Button).attrs({
  variant: 'plain',
})`
  &.btn.btn-plain {
    background-color: ${colors.neutral.white};
    color: ${colors.neutral.dark};
    border: 1px solid ${colors.neutral.pale};
    padding: 1rem 2rem;
    min-width: 10rem;
  }
`;

const PrimaryButton = styled(Button).attrs({
  variant: 'primary',
})`
  &.btn {
    padding: 1rem 2rem;
  }
`;


const Controls = observer(({ ux: {
  onPublishClick, onSaveAsDraftClick, onCancel, steps: {
    isFirst, isLast, goForward, goBackward, canGoForward,
  } } }) => {

  let rightButtons = [];

  if (isLast) {
    rightButtons = [
      <Button key="draft" variant="secondary" onClick={onSaveAsDraftClick}>Save as Draft</Button>,
      <PrimaryButton key="publish" onClick={onPublishClick}>Publish</PrimaryButton>,
    ];
  } else {
    rightButtons = [
      <PrimaryButton key="forward" disabled={!canGoForward} onClick={goForward}>Save & Continue</PrimaryButton>,
    ];
  }

  return (
    <Footer className="controls">
      <FooterInner>
        <LeftButton onClick={isFirst ? onCancel : goBackward}>
          {isFirst ? 'Cancel' : 'Back'}
        </LeftButton>
        <Spacer />
        {rightButtons}
      </FooterInner>
    </Footer>
  );
});

Controls.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Controls;
