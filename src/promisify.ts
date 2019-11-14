/**
 * 让一个遵循异常优先的回调风格的函数，
 * 即 (err, value) => ... 回调函数是最后一个参数，
 * 返回一个返回值是一个 promise 版本的函数。
 */

/**
 * 回调函数，(err, value1，value2, ...) => void，
 * 支持回调函数内有多个参数，但是第一个参数必须是错误
 */
export type Callback = (error: Error | null, ...args: Array<any>) => void;

/**
 * promisify返回的包装后的函数类型，
 * Promise内返回参数的数组
 */
export type PromisifyFunc = (...args: Array<any>) => Promise<Array<any>>;

/**
 * 包装函数
 * @param { Function } func: 被包装的函数
 * @return { PromisifyFunc }
 */
function promisify(func: Function): PromisifyFunc {
  /**
   * @param { Array<any> } args: 传递的参数
   * @return { Promise<Array<any>> }
   */
  return function(...args: Array<any>): Promise<Array<any>> {
    return new Promise((resolve: Function, reject: Function): void => {
      func(...args, function(error: Error | null, ...args: any[]): void {
        if (error) {
          reject(error);
        } else {
          resolve(args); // 直接将其他值作为数组传递
        }
      });
    });
  };
}

export default promisify;