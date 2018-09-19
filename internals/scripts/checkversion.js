const exec = require('child_process').exec;

function checkVersion(options) {
  let appName = options.name,
    command = options.command,
    version = options.version;

  exec(command, function(err, stdout, stderr) {
    if (!err) {
      if (parseFloat(stdout) < version) {
        err = new Error(
          `[ERROR: React Boilerplate] You need ${appName} version @>=${version}`
        );
      }
    }
    if (err) {
      throw err;
    }
  });
}

[
  {
    appName: 'npm',
    command: 'npm -v',
    version: 5,
  },
  {
    appName: 'node',
    command: 'node -v',
    version: 8,
  },
].forEach(opt => checkVersion(opt));
