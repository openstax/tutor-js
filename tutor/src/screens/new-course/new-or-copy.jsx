import PropTypes from 'prop-types';
import { React, action, observer } from 'vendor';
import { partial } from 'lodash';

import { Listing, Choice } from '../../components/choices-listing';
import BuilderUX from './ux';

@observer
export default
class NewOrCopy extends React.Component {

  static title = 'Do you want to create a new course or copy a previous course?';

  static propTypes = {
      ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  onSelect(value) {
      this.props.ux.newCourse.new_or_copy = value;
  }

  render() {
      return (
          <Listing>
              <Choice
                  key="course-new"
                  active={this.props.ux.newCourse.new_or_copy === 'new'}
                  onClick={partial(this.onSelect, 'new')}
                  data-new-or-copy="new"
              >
          Create a new course
              </Choice>
              <Choice
                  key="course-copy"
                  active={this.props.ux.newCourse.new_or_copy === 'copy'}
                  onClick={partial(this.onSelect, 'copy')}
                  data-new-or-copy="copy"
              >
          Copy a past course
              </Choice>
          </Listing>
      );
  }
}
