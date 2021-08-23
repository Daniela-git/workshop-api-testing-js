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

  describe('checking if the gist exist', () => {
    let gistInfo;
    beforeEach(async () => {
      res = await githubReq.authGet(gist.url);
      gistInfo = res.body;
    });
    it('the gist should exist', () => {
      expect(gistInfo.id).to.eq(gist.id);
      expect(gistInfo).to.exist;
    });
  });

  describe('delete the gist', () => {
    let resDelete;
    beforeEach(async () => {
      resDelete = await githubReq.authDelete(gist.url);
    });
    it('the gist should be deleted', () => {
      expect(resDelete.status).to.eq(statuscode.NO_CONTENT);
    });

    describe('checking if the gist was delete', () => {
      let resCheckDelete;
      beforeEach(async () => {
        try {
          await githubReq.authGet(gist.url);
        } catch (error) {
          resCheckDelete = error.status;
        }
      });
      it('the gist should exist', () => {
        expect(resCheckDelete).to.eq(statuscode.NOT_FOUND);
      });
    });
  });
});
