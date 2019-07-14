jest.mock('../dbHelper');

const TestDbHelper = require('../models/__tests__/testUtils/testDbHelper');
const request = require('supertest');
const app = require('../app');
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

test('User login with correct username and password', async () => {
  const mockUser = await createMockUserInDb();

  const res = await request(app)
    .post(`/api/pomodoro/login`)
    .send(mockUser);

  expect(res.status).toEqual(200);
  expect(res.body).toEqual({status: 'logged in'});
});

test('User login with incorrect username and password', async () => {
  await createMockUserInDb();

  const res = await request(app)
    .post(`/api/pomodoro/login`)
    .send({username: 'user', password: 'wrong'});

  expect(res.status).toEqual(302);
});

async function createMockUserInDb() {
  const mockUser = {username: 'user', password: 'pass'};
  await new Users(mockUser).save();

  return mockUser;
}