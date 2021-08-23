const expect = require('chai').expect;
const statuscode = require('http-status-codes');
const githubReq = require('../src/GithubRequest.js');

const urlBase = 'https://github.com';
const newUrl = `${urlBase}/aperdomob/new-redirect-test`;
const url = `${urlBase}/aperdomob/redirect-test`;
describe('Trying head method', () => {
  let resHead;
  beforeEach(async () => {
    try {
      await githubReq.authHead(url);
    } catch (error) {
      resHead = error;
    }
  });
  it('checking the redirect exist', () => {
    expect(resHead.status).to.eq(statuscode.MOVED_PERMANENTLY);
    expect(resHead.response.header.location).to.equal(newUrl);
  });

  describe('checking the redirect works', () => {
    let resRedirect;
    beforeEach(async () => {
      resRedirect = await githubReq.authGet(url);
    });
    it('the url must be the new url', () => {
      expect(resRedirect.status).to.eq(statuscode.OK);
    });
  });
});
