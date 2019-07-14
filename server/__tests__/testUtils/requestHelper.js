const request = require('supertest');

exports.createAuthenticatedRequest = async function (app, loginDetails) {
  const authenticatedRequest = request.agent(app);
  const loginResponse = await authenticatedRequest
    .post('/api/pomodoro/login')
    .send(loginDetails);
  return {loginResponse, authenticatedRequest};
};