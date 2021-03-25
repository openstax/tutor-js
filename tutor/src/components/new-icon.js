import { React, PropTypes, styled } from 'vendor';
import { colors } from '../theme';

const IconBackground = styled.div`
    display: inline-block;
    background: ${colors.bright_green};
    color: #fff;
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: 800;
    letter-spacing: 1px;
    box-shadow: none;
    padding: 2px;
    border-radius: 2px;
    vertical-align: middle;
`;

const LeftArrow = styled.div`
    display: inline-block;
    margin-left: 2px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent; 
    border-right:5px solid ${colors.bright_green};
`;

const NewIcon = ({ children }) => {
    return (
        <>
            {children}
            <LeftArrow/>
            <IconBackground>
           New
            </IconBackground>
        </>
    );
};
NewIcon.propTypes = {
    children: PropTypes.node.isRequired,
};


export default NewIcon;