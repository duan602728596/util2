const { expect } = require('chai');
const { default: mapAsync } = require('../lib/mapAsync');

describe('mapAsync func test', function() {
  describe('should return an array', function() {
    it('should return an array if in async function', async function() {
      function add(num) {
        return new Promise(((resolve, reject) => resolve(num + 12)));
      }

      const arr = [2, 4, 6, 8];

      const result = await mapAsync(arr, async function(value, index, array) {
        return await add(value + index);
      });

      expect(result).to.be.an('array');
      expect(result).to.be.eql([14, 17, 20, 23]);
    });

    it('should return a Promise if in function', function() {
      // eslint-disable-next-line require-await
      const result = mapAsync([0, 1, 2, 3], async function(value, index, array) {
        return value;
      });

      expect(result instanceof Promise).to.be.true;
    });
  });

  describe('should return the correct this point', function() {
    it('should the type of this is string', async function() {
      let mapAsyncCallbackFuncThis = null;

      // eslint-disable-next-line require-await
      await mapAsync([0], async function(value, index, array) {
        mapAsyncCallbackFuncThis = this;

        return value;
      }, 'this');

      expect(mapAsyncCallbackFuncThis instanceof String).to.be.true;
    });

    it('should the type of this is globalThis', async function() {
      let mapAsyncCallbackFuncThis = null;

      // eslint-disable-next-line require-await
      await mapAsync([0], async (value, index, array) => {
        mapAsyncCallbackFuncThis = this;

        return value;
      }, 'this');

      expect(mapAsyncCallbackFuncThis).to.be.eql(globalThis);
    }.bind(globalThis));
  });
});