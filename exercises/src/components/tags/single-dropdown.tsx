import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components'

import { get, map }  from 'lodash';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { action, computed, modelize } from 'shared/model'
import Wrapper from './wrapper';
import ReactSelect from 'react-select'

const Select = styled(ReactSelect)`
    flex: 1;
    z-index: 4;
`

interface SingleDropdownProps {
    exercise: Exercise
    label: string
    type: string
    specifier?: string
    readonly: boolean
    icon: React.ReactNode
    choices: Record<string, string>
}


interface SelectOption {
    label: string
    value: string
}

@observer
class SingleDropdown extends React.Component<SingleDropdownProps> {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
        label:   PropTypes.string.isRequired,
        type:  PropTypes.string.isRequired,
        specifier: PropTypes.string,
        readonly: PropTypes.bool,
        icon: PropTypes.node,
        choices: PropTypes.object.isRequired,
    };

    constructor(props: SingleDropdownProps) {
        super(props);
        modelize(this);
    }

    @computed get options():SelectOption[] {
        return map(this.props.choices, (label, value)=> ({ label, value }))
    }

    @action.bound onChange(option?: SelectOption) {
        if (option) {
            const tag = this.props.specifier ?
                this.props.exercise.tags.findOrAddWithTypeAndSpecifier(this.props.type, this.props.specifier) :
                this.props.exercise.tags.findOrAddWithType(this.props.type)
            tag.value = option.value
        } else {
            if (this.props.specifier) {
                this.props.exercise.tags.removeTypeAndSpecifier(this.props.type, this.props.specifier)
            } else {
                this.props.exercise.tags.removeType(this.props.type)
            }
        }
    }

    @computed get selectedOption() {
        const tag = this.props.specifier ?
            this.props.exercise.tags.withTypeAndSpecifier(this.props.type, this.props.specifier) :
            this.props.exercise.tags.withType(this.props.type)
        const value = get(tag, 'value', '')
        return this.options.find(opt => opt.value == value)
    }

    render() {
        return (
            <Wrapper label={this.props.label} icon={this.props.icon} singleTag={true}>
                <div className="tag">
                    <Select
                        classNamePrefix='select'
                        isClearable
                        value={this.selectedOption}
                        options={this.options}
                        onChange={this.onChange}
                    />
                </div>
            </Wrapper>
        );
    }
}

export default SingleDropdown;
