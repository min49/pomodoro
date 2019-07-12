const TestDbHelper = require('./testUtils/testDbHelper');
const Tasks = require('../tasks');

describe('Tasks', () => {
  const testDbHelper = new TestDbHelper();

  beforeAll(async () => {
    TestDbHelper.setLongTimeoutForDb();
    await testDbHelper.start();
  });

  afterAll(async () => {
    testDbHelper.setOriginalTimeout();
    await testDbHelper.stop();
  });

  beforeEach(() => {
    TestDbHelper.confirmDbIsLocal();
  });

  afterEach(async () => {
    await TestDbHelper.cleanup();
  });

  test('getTasksOfUser return all tasks of the user', async () => {
    expect.assertions(1);

    const {task1, task2, task3} = await createSampleTasksInDb();
    const tasks = await Tasks.getTasksOfUser(task1.userId);

    expect(tasks.length).toEqual(3);
  });

  test('create a new task for the user', async () => {
    await Tasks.addTask(TASKS[0]);

    const found = await Tasks.find({});
    expect(found.length).toEqual(1);

    for (let p in TASKS[0]) {
      if (TASKS[0].hasOwnProperty(p)) {
        expect(TASKS[0][p]).toEqual(found[0][p]);
      }
    }
  });
});

const TASKS = [
  {userId: 'abc', name: 'Work', focusTime: 25, relaxTime: 5},
  {userId: 'abc', name: 'Learn', focusTime: 30, relaxTime: 4},
  {userId: 'abc', name: 'Nap', focusTime: 35, relaxTime: 6},
  {userId: 'def', name: 'Sing', focusTime: 20, relaxTime: 5}
];

async function createSampleTasksInDb() {
  const task0 = await new Tasks(TASKS[0]).save();
  const task1 = await new Tasks(TASKS[1]).save();
  const task2 = await new Tasks(TASKS[2]).save();
  const task3 = await new Tasks(TASKS[3]).save();
  return {task0, task1, task2, task3};
}