import { React, PropTypes, styled, observer } from 'vendor';

const Bar = styled.div`
  top: 0;
  z-index: 1029;
  position: sticky;
  height: 2px;
  background-color: red;
`;


const ImpersonationWarning = observer(({ app }) => {
  if (app && app.is_impersonating) {
    return <Bar className="impersonation-warning-bar"/>;
  }
  return null;
});

ImpersonationWarning.propTypes = {
  app: PropTypes.object,
};

export default ImpersonationWarning;
