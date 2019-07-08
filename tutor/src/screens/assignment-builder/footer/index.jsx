import {
  React, PropTypes, styled, observer,
} from '../../../helpers/react';
import UX from '../ux';
import SaveButton    from './save-button';
import DraftButton   from './save-as-draft';
import CancelButton  from './cancel-button';
import BackButton    from './back-button';
import DeleteButton  from './delete-button';
import HelpTooltip   from './help-tooltip';
import PreviewButton from './preview-button';

const Spacer = styled.div`
  flex: 1;
`;

const StyledFooter = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 15px;
  background-color: whitesmoke;
  border-top: 1px solid #f9f9f9;
  align-items: center;
  > * { margin-left: 0.5rem; }

`;

const Footer = observer(({ ux }) => {

  return (
    <StyledFooter>
      <SaveButton    ux={ux} />
      <DraftButton   ux={ux} />
      <CancelButton  ux={ux} />
      <BackButton    ux={ux} />
      <DeleteButton  ux={ux} />
      <HelpTooltip   ux={ux} />
      <Spacer />
      <PreviewButton ux={ux} />
    </StyledFooter>
  );
});

Footer.displayName = 'Footer';
Footer.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default Footer;

// <TourAnchor id="builder-draft-button">
// <DraftButton
// onClick={ux.onSaveDraft}
// isBusy={ux.isSaving}
// isDisabled={ux.isSaving}
// />
// </TourAnchor>
// <TourAnchor id="builder-cancel-button">
// <CancelButton
// onClick={ux.onCancel}
// isDisabled={ux.isSaving}
// />
// </TourAnchor>
// <TourAnchor id="builder-back-button">
// <BackButton onClick={ux.onCancel} />
// </TourAnchor>
// <TourAnchor id="builder-delete-button">
// <DeleteLink ux={ux} />
// </TourAnchor>
//
// <HelpTooltip isPublished={isPublished} />
//
// <div className="spacer" />
//
// <PreviewButton ux={ux} />
