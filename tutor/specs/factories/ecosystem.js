const {
    Factory, sequence, uuid, reference,
    TITLES,
} = require('./helpers');


Factory.define('EcosystemBook')
    .id(sequence)
    .uuid(uuid)
    .title(({ type = 'physics' }) => TITLES[type])
    .version(({ parent, index }) => `${parent.id+3}.${index}`);

Factory.define('Ecosystem')
    .id(sequence)
    .books(reference('EcosystemBook', { count: 2 }));
