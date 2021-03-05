const role = process.argv[2];

if (-1 == ['student', 'teacher'].indexOf(role)) {
    console.warn(`Usage: ${process.argv[0]} <student|teacher>`);
    process.exit(9);
}

module.exports = { role };
