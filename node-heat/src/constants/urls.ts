const GITHUB_BASE_URL = 'https://github.com';
const GITHUB_LOGIN_URL = `${GITHUB_BASE_URL}/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
const GITHUB_ACCESS_TOKEN_URL = `${GITHUB_BASE_URL}/login/oauth/access_token`;
const GITHUB_PROFILE_URL = 'https://api.github.com/user';

export {
  GITHUB_LOGIN_URL, GITHUB_ACCESS_TOKEN_URL, GITHUB_BASE_URL, GITHUB_PROFILE_URL,
};
