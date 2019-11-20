const { expect } = require('chai');
const { default: forEachAsync } = require('../lib/forEachAsync');

describe('forEachAsync func test', function() {
  describe('should return an array', function() {
    it('should return an array if in async function', async function() {
      function add(num) {
        return new Promise(((resolve, reject) => resolve(num + 12)));
      }

      const arr = [2, 4, 6, 8];
      const result = [];

      const forEachAsyncResult = await forEachAsync(arr, async function(value, index, array) {
        const addValue = await add(value + index);

        result.push(addValue);
      });

      expect(result).to.be.an('array');
      expect(result).to.be.eql([14, 17, 20, 23]);
      expect(forEachAsyncResult).to.be.undefined;
    });

    it('should return a Promise if in function', function() {
      // eslint-disable-next-line require-await
      const result = forEachAsync([0, 1, 2, 3], async function(value, index, array) {
        return value;
      });

      expect(result instanceof Promise).to.be.true;
    });
  });

  describe('should return the correct this point', function() {
    it('should the type of this is string', async function() {
      let forEachAsyncCallbackFuncThis = null;

      // eslint-disable-next-line require-await
      await forEachAsync([0], async function(value, index, array) {
        forEachAsyncCallbackFuncThis = this;

        return value;
      }, 'this');

      expect(forEachAsyncCallbackFuncThis instanceof String).to.be.true;
    });

    it('should the type of this is globalThis', async function() {
      let forEachAsyncCallbackFuncThis = null;

      // eslint-disable-next-line require-await
      await forEachAsync([0], async (value, index, array) => {
        forEachAsyncCallbackFuncThis = this;

        return value;
      }, 'this');

      expect(forEachAsyncCallbackFuncThis).to.be.eql(globalThis);
    }.bind(globalThis));
  });
});