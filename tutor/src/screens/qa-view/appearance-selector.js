import { React, observer, PropTypes } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import { map } from 'lodash';
import { BookTitles, AppearanceCodes } from '../../models';

@observer
export default class AppearanceSelector extends React.Component {

    static propTypes = {
        ux: PropTypes.object.isRequired,
    }

    render() {
        const { ux } = this.props;

        return (
            <Dropdown
                onSelect={ux.onAppearanceCodeSelect}
            >
                <Dropdown.Toggle
                    variant="ox"
                >
                    {AppearanceCodes[ux.appearance_code] || 'Book Appearance'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {map(BookTitles, (code, title) => (
                        <Dropdown.Item key={code} eventKey={code}>{title}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

        );
    }

}
