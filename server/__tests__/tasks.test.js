jest.mock('../dbHelper');

const TestDbHelper = require('../models/__tests__/testUtils/testDbHelper');
const {createAuthenticatedRequest} = require('./testUtils/requestHelper');
const app = require('../app');
const Tasks = require('../models/tasks');
const Users = require('../models/users');

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


describe('Tasks API calls', () => {
  test('get all tasks of user', async () => {
    await setupTestData();
    const authenticatedRequest = await login();

    const res = await authenticatedRequest.get(`/api/pomodoro/tasks`);
    expect(res.body.length).toEqual(3);
  });

  test('add a task', async () => {
    await setupTestData();
    const authenticatedRequest = await login();

    const testTask = {
      name: 'Test Task',
      focusTime: 33,
      relaxTime: 3
    };
    const res = await authenticatedRequest.post(`/api/pomodoro/tasks/new`)
      .send(testTask);
    expect(res.status).toEqual(201);

    for (let p in testTask) {
      if (testTask.hasOwnProperty(p)) {
        expect(testTask[p]).toEqual(res.body[p]);
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

async function setupTestData() {
  const user0 = await new Users(USERS[0]).save();
  const user1 = await new Users(USERS[1]).save();

  const tasks = TASKS.map(t => ({...t}));
  tasks[0].userId = user0._id;
  tasks[1].userId = user0._id;
  tasks[2].userId = user0._id;
  tasks[3].userId = user1._id;

  const task0 = await new Tasks(tasks[0]).save();
  const task1 = await new Tasks(tasks[1]).save();
  const task2 = await new Tasks(tasks[2]).save();
  const task3 = await new Tasks(tasks[3]).save();
  return {task0, task1, task2, task3};
}

async function login() {
  const {loginResponse, authenticatedRequest} = await createAuthenticatedRequest(
    app,
    {username: 'abc', password: 'pass'}
  );
  expect(loginResponse.status).toEqual(200);
  return authenticatedRequest;
}