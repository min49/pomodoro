const request = require('supertest');
const app = require('../../app');

exports.login = async function (loginDetails) {
  const authenticatedRequest = request.agent(app);
  const loginResponse = await authenticatedRequest
    .post('/api/pomodoro/login')
    .send(loginDetails);
  expect(loginResponse.status).toEqual(200);
  return authenticatedRequest;
};