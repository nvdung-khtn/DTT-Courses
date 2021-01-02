const Field = require('../../models/Field')
const util = require('../../utils/mongoose')

module.exports = {
    getFieldName(fieldId) {
        return Field.findOne({ _id: fieldId })
            .then(fieldDB => {
                return util.mongooseToObject(fieldDB).name;
            })
    }
}