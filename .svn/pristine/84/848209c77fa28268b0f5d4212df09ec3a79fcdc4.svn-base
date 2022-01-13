import repository from '../databaseConfig';
import I18n from 'react-native-i18n';
import _ from 'lodash';

class baseRepository {

  constructor( schemaName ) {
    this.schemaName = schemaName;
    // let schemaObj = _.find(repository.schema, { 'name': this.schemaName });
    // this.typeList = [];
    // if( schemaObj.properties ) {
    //   let typeList = _.mapValues(schemaObj.properties, 'type');
    //   _.forEach(typeList, function( value, key ) {
    //     if( value === 'list' )
    //       this.typeList.push(key)
    //   }.bind(this));
    // }
  }

  save( data ) {
    repository.write(() => {
      repository.create(this.schemaName, data);
    })
  }

  update( data ) {
    repository.write(() => {
      repository.create(this.schemaName, data, true);
    })
  }

  saveAll( callbackSave ) {
    repository.write(() => {
      let objModel = callbackSave();
      try {
        repository.create(this.schemaName, objModel);
      } catch( e ) {
        console.log(e);
      }
    })
  }

  deleteBy( filter = [], ...params ) {
    let results = repository.objects(this.schemaName);
    if( filter.length > 0 ) {
      let stringFilters = filter.join(' and ');
      let resultData = results.filtered(stringFilters, ...params);
      repository.write(() => {
        repository.delete(resultData);
      })
    } else {
      repository.write(() => {
        repository.delete(results);
      })
    }
  }

  findAllBy( count = 0, offset = 0, limit = -1, orderBy = [], objModel = [], filter = [], renderData, ...params ) {

    let stringFilters = '';
    let results = [];
    if( filter.length ) {
      stringFilters = filter.join(' and ');
    }

    let keysArray = _.isArray(objModel) ? objModel : (!_.isArray(objModel) && _.isObject(objModel)) ? Object.keys(objModel) : [];

    if( count ) {
      if( stringFilters ) {
        let a = repository.objects(this.schemaName).filtered(stringFilters, ...params);
        return a.length
      } else {
        let b = repository.objects(this.schemaName);
        return b.length
      }
    }
    if( stringFilters )
      results = repository.objects(this.schemaName).filtered(stringFilters, ...params);
    else
      results = repository.objects(this.schemaName);

    if( _.isArray(orderBy) && orderBy.length ) {
      _.map(orderBy, function( order ) {
        results = results.sorted(order);
      })
    }

    if( !_.isArray(orderBy) && _.isObject(orderBy) ) {
      _.map(Object.keys(orderBy), function( order ) {
        results = results.sorted(order, orderBy[ order ]);
      })
    }

    if( offset >= 0 && limit > 0 ) {
      results = results.slice(offset, offset + limit);
    }

    return _.map(results, function( objItem ) {
      let resultData = {};

      keysArray.map(item => {
        resultData[ item ] = objItem[ item ];
        if( this.typeList.length ) {
          if( this.typeList.indexOf(item) !== -1 )
            resultData[ item ] = _.toArray(objItem[ item ])
        }
      });

      // if( renderData )
      //   return renderData(resultData);
      return resultData;
    }.bind(this))

  }

  find( fieldId, id, objModel = {} ) {
    let results = repository.objects(this.schemaName).filtered(fieldId.toString() + " == $0", id);

    if( results.length ) {
      let resultData = {};
      let keys = Object.keys(objModel);
      keys.map(item => {
        resultData[ item ] = results[ 0 ][ item ]
      });
      return resultData
    }
    return null;
  }

  getField( fieldId, id, field ) {
    let results = repository.objects(this.schemaName).filtered(fieldId.toString() + " == $0", id);
    if( results && results[ 0 ] && !_.isUndefined(results[ 0 ][ field ]) ) {
      return results[ 0 ][ field ]
    }
    return null;
  }

  setField( fieldId, id, field, value ) {

    let objdata = {};
    objdata[ fieldId ] = id;
    objdata[ field ] = value;
    repository.write(() => {
      repository.create(this.schemaName, objdata, true);
    })
  }


}

export default baseRepository;
