function log(type, value) {
    const msg = { [`${type}`]: value };
    if (process.send) {
        process.send(msg);
    } else {
        console.log('STATUS:', JSON.stringify(msg));
    }
}

module.exports = log;
