import { React, styled } from 'vendor'
import { colors } from '../../theme'
import TutorLink from '../../components/link';

const Text = styled.div`
    margin-top: 8px;
    line-height: 2rem;
    color: ${colors.neutral.thin};

    a {
        text-decoration: underline;
    }

    cite {
        font-weight: bold;
    }
`

const Sociology3eNudge = ({ ux }: { ux: any }) => {
    if (ux.displaySoc3eSoonNudge) {
        return (
            <Text>
                A new edition <cite>Introduction to Sociology 3e</cite> will be available soon.&nbsp;
                <a href="https://openstax.org/blog/what-makes-openstax-introduction-to-sociology-unique" target="_blank">Learn more</a>
            </Text>
        )
    }

    if (ux.displaySoc3eAvailableNudge) {
        const soc3eOfferingId = ux.offerings.sociology3e.array[0].id

        return (
            <Text>
                Introduction to Sociology 2e is available until Summer 2022. <TutorLink to="createNewCourseFromOffering" params={{ offeringId: soc3eOfferingId }}>
                    Upgrade to <cite>Introduction to Sociology 3e</cite>.
                </TutorLink>
            </Text>
        )
    }

    return null;
}

export default Sociology3eNudge
