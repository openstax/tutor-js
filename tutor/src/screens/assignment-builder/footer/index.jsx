import {
  React, PropTypes, styled, observer,
} from 'vendor';
import UX from '../ux';
import SaveButton    from './save-button';
import DraftButton   from './save-as-draft';
import CancelButton  from './cancel-button';
import DeleteButton  from './delete-button';
import HelpTooltip   from './help-tooltip';

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
      <DeleteButton  ux={ux} />
      <Spacer />
      <HelpTooltip   ux={ux} />
    </StyledFooter>
  );
});

Footer.displayName = 'Footer';
Footer.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default Footer;
