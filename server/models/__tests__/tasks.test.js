const TestDbHelper = require('./testUtils/testDbHelper');
const {Tasks} = require('../tasks');
const Users = require('../users');

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

  test('getTasksOfUser() returns all tasks of the user', async () => {
    expect.assertions(1);

    const {task1} = await createSampleTasks();

    const tasks = await Tasks.getTasksOfUser(task1.userId);

    expect(tasks.length).toEqual(3);
  });

  test('add() creates a new task for the user', async () => {
    const {user0} = await createSampleUsers();
    const newTask = {
      ...TASKS[0],
      userId: user0._id
    };

    await Tasks.add(newTask);

    const found = await Tasks.find({});
    expect(found.length).toEqual(1);

    for (let p in newTask) {
      if (newTask.hasOwnProperty(p)) {
        expect(newTask[p]).toEqual(found[0][p]);
      }
    }
  });
});

const USERS = [
  {username: 'abc', password: 'pass'},
  {username: 'def', password: 'word'}
];

const TASKS = [
  {name: 'Work', focusTime: 25, relaxTime: 5},
  {name: 'Learn', focusTime: 30, relaxTime: 4},
  {name: 'Nap', focusTime: 35, relaxTime: 6},
  {name: 'Sing', focusTime: 20, relaxTime: 5}
];

async function createSampleUsers() {
  const user0 = await new Users(USERS[0]).save();
  const user1 = await new Users(USERS[1]).save();
  return {user0, user1};
}

async function createSampleTasks() {
  const {user0, user1} = await createSampleUsers();

  TASKS[0].userId = user0._id;
  TASKS[1].userId = user0._id;
  TASKS[2].userId = user0._id;
  TASKS[3].userId = user1._id;

  const task0 = await new Tasks(TASKS[0]).save();
  const task1 = await new Tasks(TASKS[1]).save();
  const task2 = await new Tasks(TASKS[2]).save();
  const task3 = await new Tasks(TASKS[3]).save();
  return {task0, task1, task2, task3};
}