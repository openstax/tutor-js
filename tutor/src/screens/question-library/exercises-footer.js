import { React, useState, styled } from 'vendor';
import { Button } from 'react-bootstrap';
import Terms from '../../components/add-edit-question/terms-of-use';
import { colors } from 'theme';
import UserMenu from '../../models/user/menu';

const StyledExercisesFooter = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 2rem 4.5rem;
    .btn.btn-link {
        padding-top: 0;
        padding-bottom: 0;
    }
    p {
        color: ${colors.neutral.thin};
        margin-bottom: 0;
        line-height: 2.4rem;
    }
`;

const ExercisesFooter = () => {
    const [showTerms, setShowTerms] = useState(false);
    return (
        <StyledExercisesFooter>
            <Button variant="link" onClick={() => setShowTerms(true)}>Terms of Use</Button>
            <p>
        Need more information? <a href={`mailto:${UserMenu.supportEmail}`}>Contact Support</a>
            </p>
            <Terms
                show={showTerms}
                onClose={() => setShowTerms(false)}
                displayOnly={true}
            />
        </StyledExercisesFooter>
    );
};

export default ExercisesFooter;
