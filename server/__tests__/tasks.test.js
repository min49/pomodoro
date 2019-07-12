jest.mock('../dbHelper');
jest.mock('../models/tasks');

const request = require('supertest');
const app = require('../app');
const Tasks = require('../models/tasks');

const mockTasks = [
  {userId: 'abc', name: 'Work', focusTime: 25, relaxTime: 5},
  {userId: 'abc', name: 'Learn', focusTime: 30, relaxTime: 4},
];

describe('Tasks API calls', () => {
  test('get all tasks of user', async () => {
    Tasks.getTasksOfUser.mockReturnValueOnce(mockTasks);
    const testUserId = 'abc';

    const res = await request(app)
      .get(`/api/pomodoro/tasks`)
      .query({userId: testUserId});

    expect(Tasks.getTasksOfUser).toBeCalledWith(testUserId);
    expect(res.body).toEqual(mockTasks);
  });

  test('add a task', async () => {
    const testTask = {
      userId: 'abc',
      name: 'Test Task',
      focusTime: 33,
      relaxTime: 3
    };

    const res = await request(app)
      .post(`/api/pomodoro/tasks/new`)
      .send(testTask);

    expect(Tasks.addTask).toBeCalledWith(testTask);
    expect(res.status).toEqual(201);
  });
});