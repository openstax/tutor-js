import React from 'react';
import cn from 'classnames';
import {
  Row, Col, FormGroup, InputGroup, Dropdown, Button,
  FormControl, DropdownButton, MenuItem,
} from 'react-bootstrap';
import Preview from './search/preview';
import Clause from './search/clause';
import Controls from './search/controls';
import { observer } from 'mobx-react';
import UX from '../ux';

@observer
class Search extends React.Component {

  static Controls = Controls;

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  };

  get search() {
    return this.props.ux.search;
  }

  componentDidMount() {
  const ex = {
    "tags": [
        "type:conceptual",
        "requires-context:true",
        "filter-type:test-prep",
        "blooms:3",
        "time:long",
        "dok:3",
        "context-cnxmod:",
        "context-cnxfeature:one-1"
    ],
    "uuid": "e74fc0af-5a18-4f3d-9cc6-2a3dbfc41cf9",
    "group_uuid": "778ef9d8-353a-435e-a7f6-f7b8edbf8765",
    "number": 1,
    "version": 1,
    "uid": "1@1",
    "authors": [
        {
            "user_id": 1
        }
    ],
    "copyright_holders": [
        {
            "user_id": 1
        }
    ],
    "derived_from": [],
    "is_vocab": false,
    "stimulus_html": "",
    "questions": [
        {
            "id": 3,
            "is_answer_order_important": false,
            "stimulus_html": "",
            "stem_html": "one",
            "answers": [
                {
                    "id": 3,
                    "content_html": "two",
                    "correctness": "1.0",
                    "feedback_html": "three"
                }
            ],
            "hints": [],
            "formats": [
                "free-response",
                "multiple-choice"
            ],
            "combo_choices": [],
            "collaborator_solutions": [
                {
                    "attachments": [],
                    "solution_type": "detailed",
                    "content_html": "four"
                }
            ],
            "community_solutions": []
        }
    ],
    "versions": [
        1
    ],
    "attachments": []
};
    this.search.exercises = [ex];
  }

  render() {

    const { clauses, exercises } = this.search;

    return (
      <div className="search">
        {clauses.map((c, i) => <Clause key={i} clause={c} />)}
        {exercises.map((e) => <Preview key={e.uuid} exercise={e} />)}
      </div>
    );
  }
}

export default Search;
