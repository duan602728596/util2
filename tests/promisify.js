const { expect } = require('chai');
const { default: promisify } = require('../lib/promisify');

describe('promisify func test', function() {
  // 传递一个函数，并且返回值是返回一个promise的函数
  describe('should pass a function, and the return value is a function that returns a promise', function() {
    // 测试函数：大于0的数字转换成字符串
    function numberToString(arg, callback) {
      if (arg === 0) callback(new Error('arg cannot be 0'));
      else callback(null, `${ arg }`);
    }

    // 包装后返回一个函数
    it('should the return value is a function', function() {
      const numberToStringPromise = promisify(numberToString);

      expect(numberToStringPromise).to.be.a('function');
    });

    // 函数执行后返回Promise
    it('should return a promise after the function is executed', function() {
      const numberToStringPromise = promisify(numberToString);
      const result = numberToStringPromise(12);

      expect(result instanceof Promise).to.be.true;
    });
  });

  // 测试函数的运行结果
  describe('test function run result', function() {
    // 测试数据能否正确返回
    it('should return an array', async function() {
      const canReturnParametersPromise = promisify(function canReturnParameters() {
        const argumentArr = [...arguments];
        const args = argumentArr.length === 1 ? [] : argumentArr.slice(0, arguments.length - 1);
        const callback = argumentArr[argumentArr.length - 1];

        callback(null, ...args);
      });

      const result0 = await canReturnParametersPromise(2, 3, 4);
      const result1 = await canReturnParametersPromise();
      const result2 = await canReturnParametersPromise(12);

      expect(result0).to.be.eql([2, 3, 4]);
      expect(result1).to.be.eql([]);
      expect(result2).to.be.eql([12]);
    });

    // 测试错误是否能够捕捉
    it('should capable of catching errors', async function() {
      const throwErrorPromise = promisify(function throwError(err, callback) {
        if (err) callback(new Error('have an error'));
        else callback(null);
      });

      try {
        await throwErrorPromise(true);
      } catch (err) {
        expect(err instanceof Error).to.be.true;
      }
    });
  });
});