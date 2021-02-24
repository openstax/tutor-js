import React from 'react';
import PropTypes from 'prop-types';
import SelectWidget from 'react-select';
import styled from 'styled-components';
import { filter } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Exercise from '../../models/exercises/exercise';
import Wrapper from './wrapper';

const StyledSelect = styled(SelectWidget)`
  flex: 1;
  margin-right: 0.5rem;
`;

@observer
class MultiSelect extends React.Component {
  static propTypes = {
      exercise: PropTypes.instanceOf(Exercise).isRequired,
      label: PropTypes.string.isRequired,
      tagType: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
          PropTypes.shape({
              value: PropTypes.string,
              label: PropTypes.string,
          })
      ).isRequired,
  }

  @action.bound updateTags(tags) {
      const { tagType, exercise } = this.props;
      exercise.tags.replaceType(tagType, tags);
  }

  render() {
      const { tagType, label, exercise, options } = this.props;

      const selected = filter(options,
          t => exercise.tags.includes({ type: tagType, value: t.value })
      );

      return (
          <Wrapper label={label}>
              <div className="tag">
                  <StyledSelect
                      isMulti
                      options={options}
                      defaultValue={selected}
                      onChange={this.updateTags}
                  />
              </div>
          </Wrapper>
      );
  }
}


export default MultiSelect;
