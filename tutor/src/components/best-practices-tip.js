import { React, PropTypes } from 'vendor';
import { Icon } from 'shared';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  color: ${props => props.theme.colors.controls.notice};
  margin-bottom: 0.5rem;
`;

const Best = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

export default
function BestPracticesTip({ children }) {
    return (
        <div>
            <Wrapper>
                <Icon type="thumbs-up" />
                <Best>BEST</Best> PRACTICE
            </Wrapper>
            <p>{children}</p>
        </div>
    );
}

BestPracticesTip.propTypes = {
    children: PropTypes.node.isRequired,
};
