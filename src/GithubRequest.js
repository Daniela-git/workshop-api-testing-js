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
  async authPost(url, query) {
    const response = await agent
      .post(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send(query);
    return response;
  }
  async authPatch(url, query) {
    const response = await agent
      .patch(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send(query);
    return response;
  }
  async authDelete(url) {
    const response = await agent
      .delete(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    return response;
  }
  async authHead(url) {
    const response = await agent
      .head(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    return response;
  }
}

module.exports = new GithubRequest();
