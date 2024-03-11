import PropTypes from 'prop-types';
import React from 'react';
import { map, isEmpty, pick } from 'lodash';

const BOOKS = {
    'stax-accounting':             'Principles of Accounting, Volumes 1-2',
    'stax-algtrig':                'Algebra and Trigonometry',
    'stax-amfg':                   'Additive Manufacturing',
    'stax-anp':                    'Anatomy and Physiology',
    'stax-anth':                   'Anthropology',
    'stax-apbio':                  'Biology for AP® Courses',
    'stax-apphys':                 'College Physics for AP® Courses',
    'stax-apush':                  'U.S. History for AP® Courses',
    'stax-astro':                  'Astronomy',
    'stax-bca':                    'Business Computer Applications',
    'stax-bio':                    'Biology',
    'stax-busethics':              'Business Ethics',
    'stax-buslaw':                 'Business Law I Essentials',
    'stax-busstats':               'Introductory Business Statistics',
    'stax-calc':                   'Calculus vol 1-3',
    'stax-calculo':                'Cálculo Volumen 1-3',
    'stax-calgebra':               'College Algebra',
    'stax-cbio':                   'Concepts of Biology',
    'stax-chem':                   'Chemistry, Chemistry Atoms First',
    'stax-cmath':                  'Contemporary Math',
    'stax-coreqalgebra':           'College Algebra with Corequisite Skills',
    'stax-cs':                     'Computer Science',
    'stax-csuccess':               'College Success',
    'stax-csuccessconcise':        'College Success Concise',
    'stax-datascience':            'Data Science',
    'stax-devpsy':                 'Developmental Psychology',
    'stax-econ':                   'Economics',
    'stax-elemalgebra':            'Elementary Algebra',
    'stax-engcomp':                'English Composition',
    'stax-eship':                  'Entrepreneurship',
    'stax-estadistica':            'Introducción a la estadística',
    'stax-estadisticaempresarial': 'Introducción a la estadística empresarial',
    'stax-fin':                    'Finance',
    'stax-hsstats':                'Statistics (high school)',
    'stax-infosys':                'Information Systems',
    'stax-interalgebra':           'Intermediate Algebra',
    'stax-introbus':               'Introduction to Business',
    'stax-ip':                     'Intellectual Property',
    'stax-k12phys':                'HS Physics',
    'stax-macro':                  'Macro Economics',
    'stax-matnewborn':             'Maternal Newborn Nursing',
    'stax-medsurg':                'Medical-Surgical Nursing',
    'stax-micro':                  'Micro Economics',
    'stax-microbio':               'Microbiology',
    'stax-mktg':                   'Principles of Marketing',
    'stax-neuroscience':           'Introduction to Behavioral Neuroscience',
    'stax-nursingfundamentals':    'Fundamentals of Nursing',
    'stax-nursingskills':          'Clinical Nursing Skills',
    'stax-nutrition':              'Nutrition',
    'stax-orgbehavior':            'Organizational Behavior',
    'stax-orgchem':                'Organic Chemistry',
    'stax-pharmacology':           'Pharmacology for Nurses',
    'stax-phi':                    'Philosophy',
    'stax-phys':                   'College Physics',
    'stax-polisci':                'Political Science',
    'stax-pom':                    'Principles of Management',
    'stax-pophealth':              'Community-Population Health',
    'stax-prealgebra':             'Prealgebra',
    'stax-precal':                 'Precalculus',
    'stax-precalculo':             'Precálculo',
    'stax-prepcsuccess':           'Preparing for College Success',
    'stax-psy':                    'Psychology',
    'stax-psychnursing':           'Psychiatric-Mental Health Nursing',
    'stax-pyth':                   'Computer Programming with Python',
    'stax-quimica':                'Química',
    'stax-soc':                    'Sociology',
    'stax-stats':                  'Introductory Statistics',
    'stax-ufisica':                'Física Universitaria',
    'stax-uphysics':               'University Physics',
    'stax-usgovt':                 'American Government',
    'stax-ushist':                 'U.S. History',
    'stax-worldhist':              'World History',
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
