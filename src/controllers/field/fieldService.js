const Field = require('../../models/Field')
const util = require('../../utils/mongoose')

module.exports = {
    
    async getFieldName(fieldId) {
        const field = await Field.findOne({_id:fieldId}).lean();
        return field.name;
    }
}