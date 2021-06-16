import PropTypes from 'prop-types'
import React from 'react'
import {
    Row, Col, InputGroup,
} from 'react-bootstrap'
import Select from 'react-select'
import { observer } from 'mobx-react'
import { field, modelize, computed } from 'shared/model'
import Books from '../../models/books'

@observer
export default
class BookSections extends React.Component {

    static propTypes = {
        search: PropTypes.object.isRequired,
    }

    static Books = Books

    @field book

    @computed get books() {
        return [{ label: 'None', value: '' }].concat(
            Books.all.map(b => { return { label: b.title, value: b.uuid }})
        )
    }

    @computed get sections() {
        return this.partsToOptions(this.book?.contents)
    }

    constructor(props) {
        super(props)
        modelize(this)
        Books.ensureLoaded()
    }

    partsToOptions(parts) {
        if (!parts) return []

        return parts.map(part => {
            const option = { label: part.title }

            if (part.contents) {
                option.options = this.partsToOptions(part.contents)
            }
            else {
                option.value = part.id
            }

            return option
        })
    }

    render() {
        const handleBookChange = (option) => {
            this.book = Books.all.find(b => b.uuid == option.value)
            if (this.book) this.book.ensureLoaded()
        }
        const handleSectionChange = (option) => {
            this.props.search.sectionUuid = option.value
        }

        return (
            <Row>
                <Col xs={8}>
                    <InputGroup>
                        <Select options={this.books} onChange={handleBookChange}/>
                        <Select options={this.sections} onChange={handleSectionChange}/>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

}
