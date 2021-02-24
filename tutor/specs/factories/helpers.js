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
    ap_ush: 'ap_us_history',
};

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
    TITLES, APPEARANCE_CODES, PLAN_TYPES,
    moment,  SECTION_NAMES,
};
