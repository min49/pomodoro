jest.mock('../dbHelper');

const request = require('supertest');
const app = require('../app');
const TestDbHelper = require('../models/__tests__/testUtils/testDbHelper');
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

test('User login with correct username and password', async () => {
  await setupTestData(DATA);

  const res = await request(app)
    .post(`/api/pomodoro/login`)
    .send({username: 'user', password: 'pass'});

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({status: 'logged in'});
});

test('User login with incorrect username and password', async () => {
  await setupTestData(DATA);

  const res = await request(app)
    .post(`/api/pomodoro/login`)
    .send({username: 'user', password: 'wrong'});

  expect(res.status).toEqual(302);
});

const DATA = [
  {username: 'user', password: 'pass', tasks: []}
];