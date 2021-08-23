const agent = require('superagent');
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
describe('All the users', () => {
  let queryTime;
  let response;
  before(async () => {
    response = await agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .use(
        responseTime((res, time) => {
          queryTime = time;
        })
      );
  });

  it('then the time should be less than 5seg', () => {
    expect(queryTime).to.be.lessThanOrEqual(5000);
  });
  it('must be 30 users', () => {
    expect(response.body.length).to.eq(30);
  });

  describe('ask for 10 users', () => {
    let tenUsers;
    beforeEach(async () => {
      tenUsers = await agent
        .get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .query({ per_page: 10 });
    });
    it('then should be 10 users', () => {
      expect(tenUsers.body.length).to.eq(10);
    });
  });
  describe('ask for 50 users', () => {
    let tenUsers;
    beforeEach(async () => {
      tenUsers = await agent
        .get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .query({ per_page: 50 });
    });
    it('then should be 10 users', () => {
      expect(tenUsers.body.length).to.eq(50);
    });
  });
});
