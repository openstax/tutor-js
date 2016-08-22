var config = {};

require('check-dependencies')(config, function(result){
  if (result.error.length){
    console.log("Errors:");
    for (var i in result.error) {
      console.log(result.error[i]);
    }
  }

  if (!result.depsWereOk){
    console.log("Dependencies were not satisifed, run `npm install`");
  }

  if (result.error.length || !result.depsWereOk){
    process.exit(1);
  }

});
