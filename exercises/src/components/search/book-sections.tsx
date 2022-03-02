import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'
import ReactSelect, { components } from 'react-select'
import { action, computed, modelize, observer } from 'shared/model'
import Books from '../../models/books'
import { BookPart } from '../../models/book'
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
export default class BookSections extends React.Component<BookSectionsProps> {

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

        return parts.flatMap(part => {
            const option: OptionType = { label: part.title }

            if (part.contents) {
                // Chapter or Unit
                const nestedOptions = this.partsToOptions(part.contents)

                if (part.contents.some(content => content.contents)) {
                    // Unit
                    return nestedOptions
                }
                else {
                    // Chapter
                    option.options = nestedOptions
                }
            }
            else {
                // Page
                option.value = part.slug
            }

            return [option]
        })
    }

    findInOptions(value: string, options?: OptionType[]): OptionType | null {
        if (!options) return null

        for (const option of options) {
            if (option.options) {
                const nestedResult = this.findInOptions(value, option.options)
                if (nestedResult) return nestedResult
            } else {
                if (option.value == value) return option
            }
        }

        return null
    }

    @computed get selectedBook() {
        return Books.all.find(book => book.slug == this.props.search.bookSlug)
    }

    @computed get bookOptions() {
        return Books.all.map(book => { return { label: book.title, value: book.slug }})
    }

    @computed get selectedBookOption(): OptionType | null {
        return this.findInOptions(this.props.search.bookSlug, this.bookOptions)
    }

    @computed get sectionOptions() {
        if (!this.selectedBook || !this.selectedBook.contents) return []
        return this.partsToOptions(this.selectedBook.contents)
    }

    @computed get selectedSectionOption(): OptionType | null {
        return this.findInOptions(this.props.search.sectionSlug, this.sectionOptions)
    }

    @action.bound handleBookChange(option?: OptionType) {
        this.props.search.sectionSlug = ''
        this.props.search.bookSlug = option?.value || ''

        if (this.props.search.bookSlug) {
            Books.all.find(book => book.slug == this.props.search.bookSlug)?.ensureLoaded()
        }
    }

    @action.bound handleSectionChange(option?: OptionType) {
        this.props.search.sectionSlug = option?.value || ''
    }

    render() {
        return (
            <>
                <span>Book:</span>
                <Select
                    isClearable
                    value={this.selectedBookOption}
                    options={this.bookOptions}
                    onChange={this.handleBookChange}
                />
                <span>Section:</span>
                <Select
                    isClearable
                    value={this.selectedSectionOption}
                    options={this.sectionOptions}
                    components={{
                        SingleValue: SelectedBookSection,
                        GroupHeading: BookChapter,
                        Option: BookSection,
                    }}
                    onChange={this.handleSectionChange}
                />
            </>
        )
    }

}
