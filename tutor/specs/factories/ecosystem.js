const {
    Factory, sequence, uuid, reference, OFFERINGS,
} = require('./helpers');


Factory.define('EcosystemBook')
    .id(sequence)
    .uuid(uuid)
    .title(({ type = 'physics' }) => OFFERINGS[type].title)
    .version(({ parent, index }) => `${parent.id+3}.${index}`);

Factory.define('Ecosystem')
    .id(sequence)
    .books(reference('EcosystemBook', { count: 2 }));
