jest.mock('../dbHelper');

const TestDbHelper = require('../models/__tests__/testUtils/testDbHelper');
const {login} = require('./testUtils/requestHelper');
const {setupTestData} = require('./testUtils/helper');

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
    await setupTestData(DATA);
    const authenticatedRequest = await login(
      {username: 'abc', password: 'pass'});

    const res = await authenticatedRequest.get(`/api/pomodoro/tasks`);
    expect(res.body.length).toEqual(3);
  });

  test('add a task', async () => {
    await setupTestData(DATA);
    const authenticatedRequest = await login(
      {username: 'abc', password: 'pass'});

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

const DATA = [
  {
    username: 'abc', password: 'pass',
    tasks: [
      {name: 'Work', focusTime: 25, relaxTime: 5},
      {name: 'Learn', focusTime: 30, relaxTime: 4},
      {name: 'Nap', focusTime: 35, relaxTime: 6},
    ]
  },
  {
    username: 'def', password: 'word',
    tasks: [
      {name: 'Sing', focusTime: 20, relaxTime: 5}
    ]
  }
];