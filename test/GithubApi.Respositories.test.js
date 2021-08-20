const agent = require('superagent');
const statusCode = require('http-status-codes');
const md5 = require('md5');
const chai = require('chai');
const expect = require('chai').expect;
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';

describe("GithubApi's GET method tests", () => {
  let user;
  beforeEach(async () => {
    const response = await agent
      .get(`${urlBase}/users/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    user = response.body;
  });
  it('get user name, company and location', async () => {
    expect(user.name).to.eq('Alejandro Perdomo');
    expect(user.company).to.eq('Perficient Latam');
    expect(user.location).to.eq('Colombia');
  });

  describe('getting repositories', () => {
    let theRepo;
    let repoInfo = {
      full_name: 'aperdomob/jasmine-awesome-report',
      private: false,
      description: 'An awesome html report for Jasmine',
    };
    beforeEach(async () => {
      const response = await agent
        .get(`${user.repos_url}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
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
        const response = await agent
          .get(
            `${theRepo.html_url}/archive/refs/heads/${theRepo.default_branch}.zip`
          )
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
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
        const response = await agent
          .get(`${theRepo.contents_url.replace('{' + '+path}', '')}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
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
