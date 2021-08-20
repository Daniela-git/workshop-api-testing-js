const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');
const statuscode = require('http-status-codes');
const githubReq = require('../src/GithubRequest.js');
const data = require('../src/data/deleteMethod.data');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
describe.only('Trying delete method', () => {
  let gist;
  let gistRes;
  beforeEach(async () => {
    const url = `${urlBase}/gists`;
    gistRes = await githubReq.authPost(url, data.query);
    gist = gistRes.body;
  });
  it('the gist should be created', () => {
    expect(gistRes.status).to.eq(statuscode.CREATED);
    expect(gist).containSubset(data.query);
  });
});
