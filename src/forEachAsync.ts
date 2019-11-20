/**
 * 模拟Array.prototype.forEach的异步方法
 * @param { Array<T> } array: 数组
 * @param { Function } callbackFunc: 异步的回调函数
 * @param { any } thisArg: 异步的回调函数内的this
 */
async function forEachAsync<T>(
  array: Array<T>,
  callbackFunc: (value: T, index: number, array: Array<T>) => Promise<void>,
  thisArg?: any
): Promise<void> {
  const callbackFuncString: string = Object.prototype.toString.call(callbackFunc);

  if (!(callbackFuncString === '[object Function]' || callbackFuncString === '[object AsyncFunction]')) {
    throw new TypeError(`${ callbackFunc } is not a function or an async function`);
  }

  const len: number = array.length;
  let index: number = 0;

  while (index < len) {
    await callbackFunc.call(thisArg, array[index], index, array);

    index += 1;
  }
}

export default forEachAsync;