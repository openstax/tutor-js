import React from 'react'
import { observer } from 'mobx-react'
import { action, modelize } from 'shared/model'
import Search from '../../models/search'
import BookSelection from '../tags/book-selection'
import styled from 'styled-components'

interface BookTagProps {
    search: Search
}

const BookSelectionWrapper = styled.span`
flex: 1;
.form-control {
    width: auto;
}
`

@observer
export default class BookTag extends React.Component<BookTagProps> {
    constructor(props: BookTagProps) {
        super(props)
        modelize(this)
    }

    @action.bound handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { search } = this.props
        const { value } = event.target

        if (value) {
            search.bookUuid = ''
            search.sectionUuid = ''
        }

        search.bookTag = value
    }

    render() {
        return (
            <BookSelectionWrapper>
                <BookSelection
                    onChange={this.handleChange}
                    selected={this.props.search.bookTag}
                    includeBlank={true}
                />
            </BookSelectionWrapper>
        )
    }

}
