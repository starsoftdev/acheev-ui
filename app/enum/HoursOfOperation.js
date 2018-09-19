/**
 * Create operation hour entity.
 * @param {Boolean} isActive  - Determine if operation is active.
 * @param {String} timeFrom  - Operation starting hour.
 * @param {String} timeTo  - Operation ending hour.
 * @returns {Object}
 */
function defineOperationHour (isActive, timeFrom, timeTo) {

  return {
    isActive: isActive,
    timeFrom: timeFrom || '',
    timeTill: timeTo || '',
  }
}


module.exports = [

  defineOperationHour (true, '08:00 AM', '05:00 PM'),
  defineOperationHour (true, '08:00 AM', '05:00 PM'),
  defineOperationHour (true, '08:00 AM', '05:00 PM'),
  defineOperationHour (true, '08:00 AM', '05:00 PM'),
  defineOperationHour (true, '08:00 AM', '05:00 PM'),
  defineOperationHour (false ),
  defineOperationHour (false )

];
