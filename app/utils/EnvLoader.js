/**
 * Env Loader will load all files in directory it's initiated with and
 * assign the variables values or use the default value set.
 */

const path = require('path');
const fs = require('fs');

class EnvLoader {
  /**
   * Constructor
   * @param {Object} options
   * @param {String} options.envDirectory - Base directory to load env variables from.
   */
  constructor(options) {
    const envDirectory = options.envDirectory || '';

    if (envDirectory === '') {
      throw new Error('Env base directory need to be assigned');
    }

    // Set properties.
    this.envDirectory = envDirectory;

    // Load env variables.
    this.load();
  }

  /**
   * Load env directory variables.
   */
  load() {
    const envDir = this.envDirectory;
    const fileList = [];

    fs.readdirSync(envDir).forEach(file => {
      const filePath = path.join(envDir, file);
      const isDir = fs.statSync(filePath).isDirectory();
      const isValidEnvFile = !isDir && !(file.indexOf('.') > -1);

      if (isValidEnvFile) {
        fileList.push(file);
      }
    });

    this.loadVariables(fileList);
  }

  /**
   * Load env variables into system.
   * @param {String[]} fileList - List of environment variables.
   */
  loadVariables(fileList) {
    const envDir = this.envDirectory;
    const envVars = [];

    fileList.forEach(file => {
      const filePath = path.join(envDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const envKey = file.toUpperCase();
      const envVal = fileContent.trim();

      if (envVal !== '') {
        envVars[envKey] = envVal;
      }
    });

    this.envVariables = envVars;
  }

  /**
   * Get environment variable value
   * @param {String} envKey  - Environment key to load.
   * @param {String} defaultValue  - Default value to set if fail to load variable.
   */
  get(envKey, defaultValue) {
    const upperEnvKey = envKey.toUpperCase();

    const envVars = this.envVariables;

    return envVars[upperEnvKey] ? envVars[upperEnvKey] : defaultValue;
  }
}

module.exports = EnvLoader;
