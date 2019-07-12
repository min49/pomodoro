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
});

async function createSampleTasksInDb() {
  const task1 = await new Tasks({
    userId: 'abc',
    name: 'Work',
    focusTime: 25,
    relaxTime: 5
  }).save();
  const task2 = await new Tasks({
    userId: 'abc',
    name: 'Learn',
    focusTime: 30,
    relaxTime: 4
  }).save();
  const task3 = await new Tasks({
    userId: 'abc',
    name: 'Nap',
    focusTime: 35,
    relaxTime: 6
  }).save();
  const task4 = await new Tasks({
    userId: 'def',
    name: 'Sing',
    focusTime: 20,
    relaxTime: 5
  }).save();

  return {task1, task2, task3, task4};
}