const agent = require('superagent');
const statusCode = require('http-status-codes');
const md5 = require('md5');
const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');
const githubReq = require('../src/GithubRequest.js');
const data = require('../src/data/GetMethod');
chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';

describe("GithubApi's GET method tests", () => {
  let user;
  beforeEach(async () => {
    const response = await githubReq.authGet(
      `${urlBase}/users/${githubUserName}`
    );
    user = response.body;
  });
  it('get user name, company and location', async () => {
    expect(user).containSubset(data.userInfo);
  });

  describe('getting repositories', () => {
    let theRepo;
    beforeEach(async () => {
      const response = await githubReq.authGet(`${user.repos_url}`);
      const repos = response.body;
      theRepo = repos.find((repo) => repo.name === repository);
    });
    it('repository information', async () => {
      expect(theRepo).containSubset(data.repoInfo);
    });
    describe('Download a repository', () => {
      let downloedRepo;
      beforeEach(async () => {
        const response = await githubReq.authGet(
          `${theRepo.html_url}/archive/refs/heads/${theRepo.default_branch}.zip`
        );
        downloedRepo = response.body;
      });
      it('the repository should be downloaded', async () => {
        expect(md5(downloedRepo)).to.equal(data.md5Value);
      });
    });

    describe("getting all the repo's files", () => {
      let theFile;
      beforeEach(async () => {
        const response = await githubReq.authGet(
          `${theRepo.contents_url.replace('{' + '+path}', '')}`
        );
        const files = response.body;
        theFile = files.find((file) => file.name === 'README.md');
      });
      it('should get the file info', () => {
        expect(theFile).containSubset(data.objInfo);
      });
    });
  });
});
//
