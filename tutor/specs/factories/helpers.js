const moment = require('moment');
const {
    Factory,
    uuid,
    sequence,
    reference,
    fake,
} = require('../../../shared/specs/factories/helpers');

const PLAN_TYPES = [ 'homework', 'reading', 'external', 'event' ];

const TITLES = {
    biology: 'Biology with Courseware',
    physics: 'College Physics',
    sociology: 'Sociology w Courseware',
    apush: 'AP US History',
};

const APPEARANCE_CODES = {
    biology: 'college_biology',
    physics: 'college_physics',
    sociology: 'intro_sociology',
    apush: 'ap_us_history',
};

const GET_OFFERINGS = [
    () => Factory.create('Offering', { id: 1, title: TITLES.biology, appearance_code: APPEARANCE_CODES.biology }),
    () => Factory.create('Offering', { id: 2, title: TITLES.physics, appearance_code: APPEARANCE_CODES.physics }),
    () => Factory.create('Offering', { id: 3, title: TITLES.sociology, appearance_code: APPEARANCE_CODES.sociology }),
    () => Factory.create('Offering', { id: 4, title: TITLES.apush, appearance_code: APPEARANCE_CODES.apush }),
]

const SECTION_NAMES = [
    'Biotechnology',
    'The Onset of Turbulence',
    'Eukaryotic Post-transcriptional Gene Regulation',
    'Satellites and Kepler’s Laws: An Argument for Simplicity',
    'Electric Hazards and the Human Body',
    'RL Circuits',
    'Sound Interference and Resonance: Standing Waves in Air Columns',
    'Angiosperms',
    'Food Irradiation',
    'Normal, Tension, and Other Examples of Forces',
    'Simple Machines',
    'Substructure of the Nucleus',
    'Regulation of Hormone Production',
    'Ecology of Ecosystems',
    'Organizing Life on Earth',
    'Environmental Limits to Population Growth',
    'Fusion',
    'Prokaryotic Transcription',
    'Breathing',
    'Centripetal Acceleration',
    'Nerve Conduction–Electrocardiograms',
    'Introduction: Further Applications of Newton’s Laws',
    'Newton\'s First Law of Motion: Inertia',
    'X Rays: Atomic Origins and Applications',
]

function rng(options) {
    return () => fake.random.number(options)
}

module.exports = {
    Factory, uuid, sequence, reference, fake, rng,
    PLAN_TYPES, GET_OFFERINGS, TITLES, APPEARANCE_CODES,
    moment,  SECTION_NAMES,
};
