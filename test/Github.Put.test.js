const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const githubReq = require('../src/GithubRequest.js');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe.only('Trying the Github api put method', () => {
  let follow;
  beforeEach(async () => {
    follow = await agent
      .put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
  });
  it('response after the follow', () => {
    expect(follow.status).to.equal(statusCode.NO_CONTENT);
    expect(follow.body).to.be.empty;
  });
  describe('Check if following a user worked', () => {
    let allFollowing;
    beforeEach(async () => {
      const response = await agent
        .get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      allFollowing = response.body.find(
        (user) => user.login === githubUserName
      );
    });
    it('shoul be following the user', () => {
      expect(allFollowing.login).to.eq(githubUserName);
    });
  });

  describe('Trying to follow the same user again', () => {
    let followAgain;
    beforeEach(async () => {
      followAgain = await agent
        .put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });
    it('response after the follow again', () => {
      expect(followAgain.status).to.equal(statusCode.NO_CONTENT);
      expect(followAgain.body).to.be.empty;
    });

    describe('Check if following a user again worked', () => {
      let allFollowing;
      beforeEach(async () => {
        const response = await agent
          .get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
        allFollowing = response.body.find(
          (user) => user.login === githubUserName
        );
      });
      it('shoul be following the user', () => {
        expect(allFollowing.login).to.eq(githubUserName);
      });
    });
  });
});
