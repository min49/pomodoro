jest.mock('../dbHelper');

const TestDbHelper = require('../models/__tests__/testUtils/testDbHelper');
const {login} = require('./testUtils/requestHelper');
const {setupTestData} = require('./testUtils/helper');
const Sessions = require('../models/sessions');

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

describe('Sessions API calls', () => {
  test('add a session', async () => {
    await setupTestData(DATA);
    const authenticatedRequest = await login(
      {username: 'abc', password: 'pass'});

    const testSession = {
      taskName: 'Learn',
      duration: 30
    };
    const requestDatetime = new Date();
    const res = await authenticatedRequest.post(`/api/pomodoro/sessions/start`)
      .send(testSession);
    expect(res.status).toEqual(201);

    expect(res.body['taskId'].toString()).toEqual(DATA[0].tasks[1].id);
    expect(res.body['duration']).toEqual(testSession['duration']);
    const startDatetime = new Date(res.body['startDatetime']);
    expect(Math.abs(startDatetime - requestDatetime)).toBeLessThan(3000);
    expect(res.body).toHaveProperty('_id');
  });

  test('stop a session', async () => {
    await setupTestData(DATA);
    const authenticatedRequest = await login(
      {username: 'abc', password: 'pass'});

    const sessionId = DATA[0].tasks[2].sessions[0].id;
    const beforeDuration = DATA[0].tasks[2].sessions[0].duration;
    const testBody = {
      sessionId,
      remainingTime: 5
    };
    const res = await authenticatedRequest.patch(`/api/pomodoro/sessions/stop`)
      .send(testBody);
    expect(res.status).toEqual(200);

    const sessionInDb = await Sessions.findById(sessionId);
    expect(sessionInDb.taskId.toString()).toEqual(DATA[0].tasks[2].id);
    expect(sessionInDb.duration).toEqual(beforeDuration - testBody.remainingTime);
    expect(sessionInDb.isCompleted).toEqual(false);
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