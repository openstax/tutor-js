var fork = require('child_process').fork;
const fd = fork('./script/dummy-server.js', [], {
  silent: true,
});
const STATUS = /^STATUS: /;

fd.stdout.on('data', function(data) {
  // output from the child process
  console.log(`got msg: ${data.slice(0,100)}`);
  // const msg = data.toString();
  // if (msg.match(STATUS)){
  //   const status = JSON.parse(msg.replace(STATUS, ''));
  //   console.log(status)
  // }
});

fd.on('message', function(msg) {
  console.log(msg)
  if (msg.status === 'invalid') {
    exit(1);
  }
  if (msg.status === 'success') {
    console.log("DINGEDING")
  }

  // if (message.name === 'READY') {
  //   // if (config.debug) {
  //   //   console.info('HappyThread[%s] is now open.', id);
  //   // }

  //   // emitReady();
  // }
  // else if (message.name === 'CONFIGURE_DONE') {
  //   assert(typeof callbacks[message.id] === 'function',
  //     "HappyThread: expected plugin to be awaiting a configuration ACK."
  //   );

  //   callbacks[message.id]();
  //   delete callbacks[message.id];
  // }
  // else if (message.name === 'COMPILED') {
  //   if (config.debug) {
  //     console.log('HappyThread[%s]: a file has been compiled. (request=%s)', id, message.id);
  //   }

  //   assert(typeof callbacks[message.id] === 'function',
  //     "HappyThread: expected loader to be pending on source file but wasn't! (this is likely an internal error!)"
  //   );

  //   callbacks[message.id](message);
  //   delete callbacks[message.id];
  // }
  // else if (message.name === 'COMPILER_REQUEST') {
  //   if (config.debug) {
  //     console.log('HappyThread[%s]: forwarding compiler request from worker to plugin:', id, message);
  //   }

  //   // TODO: DRY alert, see .createForegroundWorker() in HappyPlugin.js
  //   happyRPCHandler.execute(message.data.type, message.data.payload, function(error, result) {
  //     send({
  //       id: message.id, // downstream id
  //       name: 'COMPILER_RESPONSE',
  //       data: {
  //         compilerId: message.data.compilerId,
  //         payload: {
  //           error: error || null,
  //           result: result || null
  //         }
  //       }
  //     });
  //   });

});
