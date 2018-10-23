import { React, mobxPropTypes, observer, action, computed } from '../../helpers/react';

import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import { Listing, Choice } from '../../components/choices-listing';
import { find } from 'lodash';
import NewTabLink from '../../components/new-tab-link';
import BuilderUX from './ux';
import Icon from '../../components/icon';

export default
@observer
class Biology1eUnavailable extends React.Component {

  static title = (
    <div className="heading">
      <Icon type="bullhorn" />
      <div className="notice">
        OpenStax now uses Bio 2e!<br />
        It is no longer possible to copy first
        edition Biology courses
      </div>
    </div>
  );

  static Footer = observer(({ ux }) => (
    <div className="controls">
      <Button onClick={ux.onCancel} className="cancel">
        Cancel
      </Button>
      <Button
        onClick={() => ux.newCourse.offering = ux.alternateOffering}
        bsStyle="primary"
        className="next"
        disabled={!ux.alternateOffering}
      >
        Continue
      </Button>
    </div>
  ));

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @computed get bio2eOffering() {
    return find(this.props.ux.validOfferings,
      { is_available: true, appearance_code: 'biology_2e' },
    );
  }

  @action.bound onSelect() {
    this.props.ux.alternateOffering = (
      this.props.ux.alternateOffering ? null : this.bio2eOffering
    );
  }

  render() {
    const { bio2eOffering, props: { ux } } = this;

    return (
      <div>

        <p>
          Select Biology 2e to create a new course.  Use
          our <NewTabLink href="https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/biology_2e_conversion_guide_-_digital.pdf">transition guide</NewTabLink> to
          see chapter-by-chapter what was updated in Biology 2e.
        </p>

        {bio2eOffering && (
          <Listing>
            <Choice
              data-appearance={bio2eOffering.appearance_code}
              active={bio2eOffering === ux.alternateOffering}
              onClick={this.onSelect}
            >
              {bio2eOffering.title}
            </Choice>
          </Listing>
        )}

      </div>
    );
  }
};
