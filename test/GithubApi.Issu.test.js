const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');
const githubReq = require('../src/GithubRequest.js');
const data = require('../src/data/postMethod.data');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
describe('Trying post/patch methods', () => {
  let loginUser;
  beforeEach(async () => {
    const res = await githubReq.authGet(`${urlBase}/user`);
    loginUser = res.body;
  });
  it('should have at least one public repo', () => {
    expect(loginUser.public_repos).to.be.greaterThan(0);
  });

  describe('getting all repositories', () => {
    let repo;
    beforeEach(async () => {
      const repos = await githubReq.authGet(`${loginUser.repos_url}`);
      repo = repos.body[0];
    });
    it('then the repo should exist', () => {
      expect(repo).to.exist;
    });
    describe('Create an issue', () => {
      let issue;
      beforeEach(async () => {
        const url = `${urlBase}/repos/${loginUser.login}/${repo.name}/issues`;
        const res = await githubReq.authPost(url, {
          title: 'trying github api',
        });
        issue = res.body;
      });
      it('the issue should be created', () => {
        expect(issue).containSubset(data.issueInfo);
      });
      describe('Modify an issue', () => {
        let issueModify;
        beforeEach(async () => {
          const url = `${urlBase}/repos/${loginUser.login}/${repo.name}/issues/${issue.number}`;
          const res = await githubReq.authPatch(url, {
            body: 'check my body',
          });
          issueModify = res.body;
        });
        it('the issue should be modified', () => {
          expect(issueModify).containSubset(data.issueModifyInfo);
        });
      });
    });
  });
});
