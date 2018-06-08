import { React, mobxPropTypes, observer, action, computed } from '../../helpers/react';
import { Listing, Choice } from '../../components/choices-listing';
import { find } from 'lodash';
import NewTabLink from '../../components/new-tab-link';
import BuilderUX from './ux';

@observer
export default class Biology1eUnavailable extends React.Component {

  static title = (
    <div>
      OpenStax now uses Bio 2e!<br />
      It is no longer possible to copy first
      edition Biology courses
    </div>
  );

  static contextTypes = {
    router: React.PropTypes.object,
  }

  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @computed get bio2eOffering() {
    return find(this.props.ux.validOfferings,
      { is_available: true, appearance_code: 'biology_2e'},
    );
  }

  @action.bound onSelect() {
    this.props.ux.newCourse.offering = this.bio2eOffering;
  }

  render() {
    const { bio2eOffering, props: { ux } } = this;

    return (
      <div>

        <p>
          Select Biology 2e to create a new course.  Use
          our <NewTabLink href="https://openstax.secure.force.com/help/articles/How_To/Where-can-I-find-book-information-and-the-additional-resources?search=biology%202e">transition guide</NewTabLink> to
          see chapter-by-chapter what was updated in Biology 2e.
        </p>

        {bio2eOffering && (
           <Listing>
             <Choice
               data-appearance={bio2eOffering.appearance_code}
               active={bio2eOffering === ux.offering}
               onClick={this.onSelect}
             >
               {bio2eOffering.title}
             </Choice>
           </Listing>
        )}

      </div>
    );
  }
}
