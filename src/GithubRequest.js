const agent = require('superagent');
class GithubRequest {
  async authGet(url) {
    const response = await agent
      .get(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    return response;
  }
  async authPut(url) {
    const response = await agent
      .put(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    return response;
  }
}

module.exports = new GithubRequest();
