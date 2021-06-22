import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'
import { Box } from 'boxible'
import { Row, Col } from 'react-bootstrap'
import ReactSelect, { components } from 'react-select'
import { observer } from 'mobx-react'
import { action, modelize, computed } from 'shared/model'
import Books from '../../models/books'
import { BookPart } from  '../../models/book'
import Search from '../../models/search'

interface OptionType {
    label: string
    value?: string
    options?: OptionType[]
}

const Select = styled(ReactSelect)`
    flex: 1;
    z-index: 4;
`
const { Option, GroupHeading, SingleValue } = components

interface CustomProp {
    children: string
}
const BookChapter: React.FC<CustomProp> = ({ children, ...props }) => {
    return (
        <GroupHeading {...props as any}>
            <span dangerouslySetInnerHTML={{ __html: children }} />
        </GroupHeading>
    )
};
const BookSection: React.FC<CustomProp> = ({ children, ...props }) => {
    return (
        <Option {...props as any}>
            <span dangerouslySetInnerHTML={{ __html: children }} />
        </Option>
    )
};
const SelectedBookSection: React.FC<CustomProp> = ({ children, ...props }) => {
    return (
        <SingleValue {...props as any}>
            <span dangerouslySetInnerHTML={{ __html: children }} />
        </SingleValue>
    )
};

interface BookSectionsProps {
    search: Search
}

@observer
export default
class BookSections extends React.Component<BookSectionsProps> {

    static propTypes = {
        search: PropTypes.object.isRequired,
    }

    static Books = Books

    constructor(props: BookSectionsProps) {
        super(props)
        modelize(this)
        Books.ensureLoaded()
    }

    partsToOptions(parts?: BookPart[]): OptionType[] {
        if (!parts) return []

        return parts.map(part => {
            const option:OptionType = { label: part.title }

            if (part.contents) {
                option.options = this.partsToOptions(part.contents)
            }
            else {
                option.value = part.id.split('@', 1)[0]
            }

            return option
        })
    }

    findInOptions(value: string, options?: OptionType[]): OptionType | undefined {
        if (!options) return undefined

        for (const option of options) {
            if (option.options) {
                const nestedResult = this.findInOptions(value, option.options)
                if (nestedResult) return nestedResult
            } else {
                if (option.value == value) return option
            }
        }

        return undefined
    }

    @computed get selectedBook(): OptionType | undefined {
        if (this.book) {
            return { label: this.book.title, value: this.book.uuid }
        }
        return undefined
    }

    @computed get selectedBookChapterSection(): OptionType | undefined {
        return this.findInOptions(this.props.search.sectionUuid, this.sections)
    }

    @computed get books() {
        return Books.all.map(b => { return { label: b.title, value: b.uuid }})
    }

    @computed get book() {
        return Books.all.find(b => b.uuid == this.props.search.bookUuid)
    }

    @computed get sections() {
        if (!this.book || !this.book.contents) return []
        return this.partsToOptions(this.book.contents)
    }

    @action.bound handleBookChange(option?: OptionType) {
        this.props.search.bookUuid = option?.value || ''
        this.props.search.sectionUuid = ''
        if (this.props.search.bookUuid) {
            Books.all.find(b => b.uuid == this.props.search.bookUuid)?.ensureLoaded()
        }
    }

    @action.bound handleSectionChange(option?: OptionType) {
        this.props.search.sectionUuid = option?.value || ''
    }

    render() {
        return (
            <Row className="book-limit">
                <Col xs={8}>
                    <Box align="center" gap margin="bottom">
                        <b>Limit results to book section:</b>
                        <Select
                            isClearable
                            value={this.selectedBook}
                            options={this.books}
                            onChange={this.handleBookChange}
                        />
                        <Select
                            isClearable
                            value={this.selectedBookChapterSection}
                            options={this.sections}
                            components={{
                                SingleValue: SelectedBookSection,
                                GroupHeading: BookChapter,
                                Option: BookSection,
                            }}
                            onChange={this.handleSectionChange}
                        />
                    </Box>
                </Col>
            </Row>
        )
    }

}
