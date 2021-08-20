const agent = require('superagent');
const statusCode = require('http-status-codes');
const md5 = require('md5');
const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');
const githubReq = require('../src/GithubRequest.js');
chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';

describe.only("GithubApi's GET method tests", () => {
  let user;
  let userInfo = {
    name: 'Alejandro Perdomo',
    company: 'Perficient Latam',
    location: 'Colombia',
  };
  beforeEach(async () => {
    const response = await githubReq.authGet(
      `${urlBase}/users/${githubUserName}`
    );
    user = response.body;
  });
  it('get user name, company and location', async () => {
    expect(user).containSubset(userInfo);
  });

  describe('getting repositories', () => {
    let theRepo;
    let repoInfo = {
      full_name: 'aperdomob/jasmine-awesome-report',
      private: false,
      description: 'An awesome html report for Jasmine',
    };
    beforeEach(async () => {
      const response = await githubReq.authGet(`${user.repos_url}`);
      const repos = response.body;
      theRepo = repos.find((repo) => repo.name === repository);
    });
    it('repository information', async () => {
      expect(theRepo).containSubset(repoInfo);
    });
    describe('Download a repository', () => {
      let md5Value = 'c95c49b42787e38e0d02793d605395f1';
      let downloedRepo;

      beforeEach(async () => {
        const response = await githubReq.authGet(
          `${theRepo.html_url}/archive/refs/heads/${theRepo.default_branch}.zip`
        );
        downloedRepo = response.body;
      });
      it('the repository should be downloaded', async () => {
        expect(md5(downloedRepo)).to.equal(md5Value);
      });
    });

    describe("getting all the repo's files", () => {
      let theFile;
      const objInfo = {
        name: 'README.md',
        path: 'README.md',
        sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484',
      };
      beforeEach(async () => {
        const response = await githubReq.authGet(
          `${theRepo.contents_url.replace('{' + '+path}', '')}`
        );
        const files = response.body;
        theFile = files.find((file) => file.name === 'README.md');
      });
      it('should get the file info', () => {
        expect(theFile).containSubset(objInfo);
      });
    });
  });
});
//
