import baseRepository from './baseRepository';
import configurationModel from '../model/configurationModel';

class configurationRepository extends baseRepository {
  constructor() {
    super('Configuration')
  }

  findObj() {
    return super.find('id', 1, new configurationModel())
  }

  setField( field, value ) {
    return super.setField('id', 1, field, value)
  }


  getField( field ) {
    return super.getField('id', 1, field)
  }
  
  
}

export default configurationRepository;

