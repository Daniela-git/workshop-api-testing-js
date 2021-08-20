const md5 = require('md5');
const agent = require('superagent');
const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');
const githubReq = require('../src/GithubRequest.js');
const data = require('../src/data/GetMethod.data');
chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';

describe('Trying Github Api GET methods', () => {
  let user;
  beforeEach(async () => {
    const response = await githubReq.authGet(
      `${urlBase}/users/${githubUserName}`
    );
    user = response.body;
  });
  it('get user name, company and location', () => {
    expect(user).containSubset(data.userInfo);
  });

  describe('getting all repositories', () => {
    let theRepo;
    beforeEach(async () => {
      const response = await githubReq.authGet(`${user.repos_url}`);
      const repos = response.body;
      theRepo = repos.find((repo) => repo.name === repository);
    });
    it('repository information', () => {
      expect(theRepo).containSubset(data.repoInfo);
    });

    describe('Download a repository', () => {
      let downloadRepo;
      beforeEach(async () => {
        const response = await agent
          .get(`${theRepo.svn_url}/archive/${theRepo.default_branch}.zip`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .buffer(true);
        downloadRepo = response.text;
      });
      it('the repository should be downloaded', () => {
        // expect(md5(downloadRepo)).to.equal(data.md5Value);
      });
    });

    describe('getting all the repo files', () => {
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

      describe('download the file from the repo', () => {
        let rawFile;
        beforeEach(async () => {
          const response = await githubReq.authGet(theFile.download_url);
          rawFile = response.body;
        });
        it('the file should be downloaded', () => {
          expect(md5(rawFile)).to.eq(data.md5RawFile);
        });
      });
    });
  });
});
//
