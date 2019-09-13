jest.mock('../../dbHelper');

const TestDbHelper = require('../../models/__tests__/testUtils/testDbHelper');
const {login} = require('../../__tests__/testUtils/requestHelper');
const {setupTestData} = require('../../__tests__/testUtils/helper');

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

async function testRouteRequiredBodyFields(method, route, requiredFields) {
  await setupTestData(DATA);
  const authenticatedRequest = await login(
    {username: 'abc', password: 'pass'}
  );

  let res;
  if (method === 'post') {
    res = await authenticatedRequest.post(`/api/pomodoro/${route}`).send({});
  } else if (method === 'patch') {
    res = await authenticatedRequest.patch(`/api/pomodoro/${route}`).send({});
  } else if (method === 'delete') {
    res = await authenticatedRequest.delete(`/api/pomodoro/${route}`).send({});
  } else {
    throw new Error('Invalid request method.');
  }

  for (const f of requiredFields) {
    expect(res.text).toMatch(new RegExp(`${f} is required`, 'i'));
  }
}

describe('Test required body fields for routes', () => {
  test('tasks/new', async () => {
    await testRouteRequiredBodyFields('post', 'tasks/new', ['name', 'focusTime', 'relaxTime']);
  });

  test('tasks/edit', async () => {
    await testRouteRequiredBodyFields('patch', 'tasks/edit', ['taskId', 'name', 'focusTime', 'relaxTime']);
  });

  test('tasks/delete', async () => {
    await testRouteRequiredBodyFields('delete', 'tasks/delete', ['taskId']);
  });

  test('sessions/start', async () => {
    await testRouteRequiredBodyFields('post', 'sessions/start', ['duration', 'taskName']);
  });

  test('sessions/stop', async () => {
    await testRouteRequiredBodyFields('patch', 'sessions/stop', ['sessionId', 'remainingTime']);
  });

  test('sessions/finish', async () => {
    await testRouteRequiredBodyFields('patch', 'sessions/finish', ['sessionId']);
  });

  test('users/register', async () => {
    await testRouteRequiredBodyFields('post', 'users/register', ['username', 'password']);
  });

  test('users/changepassword', async () => {
    await testRouteRequiredBodyFields('patch', 'users/changepassword', ['currentPassword', 'newPassword']);
  });

  test('login', async () => {
    await testRouteRequiredBodyFields('post', 'login', ['username', 'password']);
  });
});

const DATA = [
  {
    username: 'abc', password: 'pass',
    tasks: [
      {name: 'Work', focusTime: 25, relaxTime: 5},
      {name: 'Learn', focusTime: 30, relaxTime: 4},
      {
        name: 'Nap', focusTime: 35, relaxTime: 6,
        sessions: [
          {
            startDatetime: new Date('2019-07-16T19:40:04.374Z'),
            isCompleted: false,
            duration: 35
          },
          {
            startDatetime: new Date('2019-07-15T10:30:00Z'),
            isCompleted: false,
            duration: 35
          }
        ]
      },
    ]
  },
  {
    username: 'def', password: 'word',
    tasks: [
      {name: 'Sing', focusTime: 20, relaxTime: 5}
    ]
  }
];
