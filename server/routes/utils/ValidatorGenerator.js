const {body} = require('express-validator');
const Schema = require('mongoose').Schema;

class ValidatorGenerator {
  /**
   * @param schemaObj - Object passed in creating Mongoose Schema
   * @param requiredFields - array of required fields to validate
   *                         {schemaTypeName, bodyFieldName} OR string if both names are the same.
   * @param optionalFields - array of optional fields to validate
   *                         {schemaTypeName, bodyFieldName} OR string if both names are the same.
   * @returns [] - array of Validation Chains to use as Express middleware
   */
  static forSchema(schemaObj, requiredFields = [], optionalFields = []) {
    function getNames_FormatChecked(fieldEntry) {
      switch (typeof fieldEntry) {
        case 'string':
          return [fieldEntry, fieldEntry];
        case 'object':
          const values = Object.entries(fieldEntry);
          if (values.length !== 1 || typeof values[0][1] !== 'string') {
            throw new Error('Incorrect argument format.');
          }
          return [values[0][0], values[0][1]];
        default:
          throw new Error('Incorrect argument format.');
      }
    }

    function makeValidators(baseValidation) {
      return ((fieldEntry) => {
        const [schemaTypeName, bodyFieldName] = getNames_FormatChecked(fieldEntry);

        if (schemaTypeName === '_id') {
          return ValidatorGenerator.forOneField(baseValidation, bodyFieldName, {type: Schema.Types.ObjectId});
        } else if (schemaObj.hasOwnProperty(schemaTypeName)) {
          return ValidatorGenerator.forOneField(baseValidation, bodyFieldName, schemaObj[schemaTypeName])
        } else {
          throw new Error(`Invalid SchemaType name for validation: ${schemaTypeName}`);
        }
      });
    }

    let validators = [];
    validators.push(requiredFields.map(makeValidators(this.required)));
    validators.push(optionalFields.map(makeValidators(this.optional)));
    return validators;
  }

  static required(field) {
    return body(field).exists().withMessage(`${field} is required.`).bail();
  }

  static optional(field) {
    return body(field).if(body(field).exists());
  }

  /**
   * @param validate - Function that returns express-validation Validation Chain
   * @param field - Name of field to validate
   * @param schemaSpec - Object (mongoose schemaType) to provide validation requirements
   * @returns express-validation Validation Chain
   */
  static forOneField(validate, field, schemaSpec) {
    switch (schemaSpec.type) {
      case String:
        return validate(field).isString().withMessage(`${field} value is invalid.`)
          .isLength({min: 1, max: schemaSpec.max})
          .withMessage(`${field} cannot be longer than ${schemaSpec.max} characters.`);
      case Number:
        return validate(field).isInt({min: 1, max: 99})
          .withMessage(`${field} should be a number between 1 and 99`);
      case Schema.Types.ObjectId:
        return validate(field).isMongoId();
      default:
        return validate(field).custom(() => false).withMessage(`Validation for field:${field} not implemented.`);
    }
  }
}

module.exports = ValidatorGenerator;