const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const githubReq = require('../src/GithubRequest.js');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Trying the Github api put method', () => {
  let follow;
  beforeEach(async () => {
    follow = await githubReq.authPut(
      `${urlBase}/user/following/${githubUserName}`
    );
  });
  it('response after the follow', () => {
    expect(follow.status).to.equal(statusCode.NO_CONTENT);
    expect(follow.body).to.be.empty;
  });
  describe('Check if following a user worked', () => {
    let allFollowing;
    beforeEach(async () => {
      const response = await githubReq.authGet(`${urlBase}/user/following`);
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
      followAgain = await githubReq.authPut(
        `${urlBase}/user/following/${githubUserName}`
      );
    });
    it('response after the follow again', () => {
      expect(followAgain.status).to.equal(statusCode.NO_CONTENT);
      expect(followAgain.body).to.be.empty;
    });

    describe('Check if following a user again worked', () => {
      let allFollowing;
      beforeEach(async () => {
        const response = await githubReq.authGet(`${urlBase}/user/following`);
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
