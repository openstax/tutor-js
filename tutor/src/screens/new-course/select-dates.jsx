import { React, PropTypes, observer, action, styled } from 'vendor';
import theme from 'theme';
import { partial } from 'lodash';
import { Listing, Choice as ChoiceWrapper } from '../../components/choices-listing';
import OfferingUnavailable from './offering-unavail';
import BuilderUX from './ux';

const Subnote = styled.div`
  font-size: 12px;
  text-transform: lowercase;
  margin-top: 0.5rem;
  font-weight: 100;
`;

const DisabledLegend = styled(Subnote)`
  margin-top: 1.5rem;
  color: ${theme.colors.neutral.std};
`;

const Choice = observer(({ available, term, active, onClick }) => (
  <ChoiceWrapper
    active={active}
    disabled={!available}
    onClick={available ? onClick : null}
  >
    <div>
      <span className="term" data-term={term.term}>
        {term.term}
      </span>
      <span className="year" data-year={term.year}>
        {term.year}
      </span>
      {!available && <Subnote>available after Jun 15th, 2020</Subnote>}
    </div>
  </ChoiceWrapper>
));

Choice.propTypes = {
  available: PropTypes.bool,
  term: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default
@observer
class SelectDates extends React.Component {

  static title = 'When will you teach this course?';

  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(term) {
    this.props.ux.newCourse.term = term;
  }

  render() {
    const { ux, ux: { offering } } = this.props;
    if (!offering) {
      return <OfferingUnavailable />;
    }

    return (
      <>
        <Listing>
          {offering.validTerms.map((term, index) =>
            <Choice
              key={index}
              available={true}
              term={term}
              active={term.isEqual(ux.newCourse.term)}
              onClick={partial(this.onSelect, term)}
            />)}
          {offering.invalidTerms.map((term, index) =>
            <Choice
              key={index}
              available={false}
              term={term}
              active={term.isEqual(ux.newCourse.term)}
              onClick={partial(this.onSelect, term)}
            />)}
        </Listing>
        <DisabledLegend>
          Fall and Winter 2020 courses will be available with
          written-response questions and a new, improved Student Scores page.
        </DisabledLegend>
      </>
    );
  }
}
