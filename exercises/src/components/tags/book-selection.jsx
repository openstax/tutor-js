import PropTypes from 'prop-types';
import React from 'react';
import { map, isEmpty, pick } from 'lodash';

const BOOKS = {
    'stax-amfg':                'Additive Manufacturing',
    'stax-anp':                 'Anatomy and Physiology',
    'stax-anth':                'Anthropology',
    'stax-apbio':               'Biology for AP® Courses',
    'stax-apphys':              'College Physics for AP® Courses',
    'stax-apush':               'U.S. History for AP® Courses',
    'stax-bca':                 'Business Computer Applications',
    'stax-bio':                 'Biology',
    'stax-cbio':                'Concepts of Biology',
    'stax-cmath':               'Contemporary Math',
    'stax-cs':                  'Computer Science',
    'stax-datascience':         'Data Science',
    'stax-devpsy':              'Developmental Psychology',
    'stax-econ':                'Economics',
    'stax-engcomp':             'English Composition',
    'stax-eship':               'Entrepreneurship',
    'stax-fin':                 'Finance',
    'stax-infosys':             'Information Systems',
    'stax-k12phys':             'HS Physics',
    'stax-macro':               'Macro Economics',
    'stax-matnewborn':          'Maternal Newborn Nursing',
    'stax-medsurg':             'Medical-Surgical Nursing',
    'stax-micro':               'Micro Economics',
    'stax-mktg':                'Principles of Marketing',
    'stax-neuroscience':        'Introduction to Behavioral Neuroscience',
    'stax-nursingfundamentals': 'Fundamentals of Nursing',
    'stax-nursingskills':       'Clinical Nursing Skills',
    'stax-nutrition':           'Nutrition',
    'stax-orgchem':             'Organic Chemistry',
    'stax-pharmacology':        'Pharmacology for Nurses',
    'stax-phi':                 'Philosophy',
    'stax-phys':                'College Physics',
    'stax-polisci':             'Political Science',
    'stax-pophealth':           'Community-Population Health',
    'stax-psy':                 'Psychology',
    'stax-psychnursing':        'Psychiatric-Mental Health Nursing',
    'stax-pyth':                'Computer Programming with Python',
    'stax-soc':                 'Sociology',
    'stax-usgovt':              'American Government',
    'stax-ushist':              'U.S. History',
    'stax-worldhist':           'World History',
};

function BookSelection(props) {
    const books = props.limit.length ? pick(BOOKS, props.limit) : BOOKS;

    return (
        <select
            className="form-control"
            onChange={props.onChange}
            value={props.selected || ''}
        >
            {(props.includeBlank || isEmpty(props.selected)) && <option key="blank" value="" />}
            {map(books, (name, tag) => (
                <option key={tag} value={tag}>
                    {name}
                </option>)
            )}
        </select>
    );
}

BookSelection.propTypes = {
    onChange: PropTypes.func,
    selected: PropTypes.string,
    limit: PropTypes.array,
    includeBlank: PropTypes.bool,
};

BookSelection.defaultProps = {
    limit: [],
};


export default BookSelection;
