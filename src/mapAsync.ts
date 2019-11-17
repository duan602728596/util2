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
  const result: Array<U> = [];

  for (let i: number = 0, j: number = array.length; i < j; i++) {
    const callbackFuncResult: U = await callbackFunc.call(thisArg, array[i], i, array);

    result.push(callbackFuncResult);
  }

  return result;
}

export default mapAsync;