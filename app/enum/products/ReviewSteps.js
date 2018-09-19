/**
 * Create review step
 * @param {Object} options
 * @param {Number} options.step  - Review step
 * @param {String} options.title  - Step title
 * @param {String[]} options.fields  - Review fields
 * @returns {Object}
 */
function createReviewStep (options) {

  return {
    step: options.step,
    title: options.title,
    fields: options.fields
  }

}


module.exports = [

  createReviewStep ({
    step: 1,
    title: 'Effect',
    fields: [
      'positiveEffects',
      'negativeEffects',
      'symptomsHelped'
    ]
  }),

  createReviewStep ({
    step: 2,
    title: 'Consumption',
    fields: [
      'durationOfEffect',
      'onset',
      'flavours',
      'methodOfConsumption',
      'timeOfConsumption'
    ]
  }),

  createReviewStep ({
    step: 3,
    title: 'Review',
    fields: [
      'title',
      'message'
    ]
  }),

  createReviewStep ({
    step: 4,
    title: 'Batch',
    fields: [
      'batch',
      'purchasedOn'
    ]
  }),

  createReviewStep ({
    step: 5,
    title: 'Upload a photo',
    fields: [
      'photos'
    ]
  })

];
