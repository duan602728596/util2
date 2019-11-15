/**
 * 队列函数，当一个任务执行完毕，执行下一个任务，
 * 同一时间最多n个任务在执行
 */

/**
 * 执行的函数，必须返回Promise
 */
export type TaskFunc = (...args: Array<any>) => Promise<any>;

/**
 * 队列的参数，[执行的函数, this, 传递给函数的参数]
 */
export type Task = [TaskFunc, any, ...Array<any>];

/**
 * 执行任务函数的返回值
 */
export type TaskExecuting = Generator<any, void, unknown>;

/**
 * 传递参数
 */
export interface QueueTaskOptions {
  taskLen: number;  // 同一时间最多同时执行的任务数
  onEnd?: Function; // 队列内所有任务都执行完毕后执行的函数
}

class QueueTask {
  private taskLen: number;
  private onEnd?: Function;
  private tasksList: Array<Task>;
  private taskExecuting: Array<TaskExecuting | undefined>;

  constructor({ taskLen, onEnd }: QueueTaskOptions) {
    this.taskLen = taskLen;                       // 同一时间最多同时执行的任务数
    this.onEnd = onEnd;                           // 队列内所有任务都执行完毕后执行的函数
    this.tasksList = [];                          // 队列
    this.taskExecuting = new Array(this.taskLen); // 正在执行的任务
  }

  /**
   * 执行一个任务
   * @param { number } index
   * @param { TaskFunc } taskFunc: 执行的函数
   * @param { any } taskFuncThis: 执行的函数的this
   * @param { Array<any> } args: 传递给执行函数的参数
   */
  *executionFunc(index: number, taskFunc: TaskFunc, taskFuncThis: any, ...args: Array<any>): TaskExecuting {
    const _this: this = this;

    yield taskFunc.call(taskFuncThis, ...args)
      .then(function(): void {
        // 任务执行完毕后，再次分配任务并执行任务
        _this.taskExecuting[index] = undefined;
        _this.run();
      });
  }

  /**
   * 添加到任务队列
   * @param { Array<Task> } tasks: 任务队列
   */
  addTasks(tasks: Array<Task>): void {
    for (const item of tasks) {
      this.tasksList.unshift(item);
    }
  }

  /**
   * 分配并执行任务
   */
  run(): void {
    // 判断任务是否执行完毕
    if (this.tasksList.length <= 0) {
      this.onEnd && this.onEnd();

      return;
    }

    const runIndex: number[] = [];

    for (let i: number = 0; i < this.taskLen; i++) {
      const len: number = this.tasksList.length;

      if (!this.tasksList[i]) {
        // 需要执行的任务
        const [workTaskFunc, workTaskFuncThis, ...args]: Task = this.tasksList[len];

        // 加入到工作队列
        this.taskExecuting[i] = this.executionFunc(i, workTaskFunc, workTaskFuncThis, ...args);

        runIndex.push(i);

        // 从任务队列内删除任务
        this.tasksList.pop();
      }
    }

    // 执行任务
    for (const index of runIndex) {
      const workTaskFunc: TaskExecuting | undefined = this.taskExecuting[index];

      if (workTaskFunc) {
        workTaskFunc.next();
      }
    }
  }
}

export default QueueTask;