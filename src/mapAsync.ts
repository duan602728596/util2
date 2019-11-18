/**
 * 模拟Array.prototype.map的异步方法
 * @param { Array<T> } array: 数组
 * @param { Function } callbackFunc: 异步的回调函数
 * @param { any } thisArg: 异步的回调函数内的this
 */
async function mapAsync<T, U>(
  array: Array<T>,
  callbackFunc: (value: T, index: number, array: Array<T>) => Promise<U>,
  thisArg?: any
): Promise<Array<U>> {
  const callbackFuncString: string = Object.prototype.toString.call(callbackFunc);

  if (!(callbackFuncString === '[object Function]' || callbackFuncString === '[object AsyncFunction]')) {
    throw new TypeError(`${ callbackFunc } is not a function or an async function`);
  }

  const result: Array<U> = [];
  const len: number = array.length;
  let index: number = 0;

  while (index < len) {
    const callbackFuncResult: U = await callbackFunc.call(thisArg, array[index], index, array);

    result.push(callbackFuncResult);

    index += 1;
  }

  return result;
}

export default mapAsync;