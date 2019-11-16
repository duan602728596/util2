const { expect } = require('chai');
const { default: QueueTask } = require('../lib/QueueTask');

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

describe('QueueTask class test', function() {
  // 任务能够按照正确的顺序执行
  describe('should tasks can be executed in the correct order', function() {
    it('should return [1, 0, 4, 2, 5, 3, 6]', async function() {
      function main() {
        return new Promise((resolve, reject) => {
          const result = []; // [1, 0, 4, 2, 5, 3, 6]

          // 几秒后，将索引插入到数组内
          const runFunc = async (index, time) => {
            await sleep(time * 1000);
            result.push(index);
          };

          const queue = new QueueTask(undefined, () => resolve(result));

          const tasks = [3, 1, 6, 10, 2, 4, 8].map((item, index) => {
            return [runFunc, undefined, index, item];
          });

          queue.addTasks(tasks);
          queue.run();
        });
      }

      const result = await main();

      expect(result).to.be.eql([1, 0, 4, 2, 5, 3, 6]);
    });
  });
});