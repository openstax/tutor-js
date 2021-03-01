const moment = require('moment');
const {
    Factory,
    uuid,
    sequence,
    reference,
    fake,
} = require('../../../shared/specs/factories/helpers');

const PLAN_TYPES = [ 'homework', 'reading', 'external', 'event' ];

const OFFERINGS = {
    biology: {
        id: 1,
        title: 'Biology with Courseware',
        appearance_code: 'college_biology',
    },
    physics: {
        id: 2,
        title: 'College Physics',
        appearance_code: 'college_physics',
    },
    sociology: {
        id: 3,
        title: 'Sociology w Courseware',
        appearance_code: 'intro_sociology',
    },
    apush: {
        id: 4,
        title: 'AP US History',
        appearance_code: 'ap_us_history',
    },
}

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
    PLAN_TYPES, OFFERINGS,
    moment,  SECTION_NAMES,
};
