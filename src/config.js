const DEFAULT_PORT = 3000;

module.exports = {
  port: Number(process.env.PORT || DEFAULT_PORT),
  jwtSecret: process.env.JWT_SECRET || 'ecocollect_uts_secret_key_change_me',
  tokenExpiresInSeconds: Number(process.env.TOKEN_EXPIRES_IN_SECONDS || 86400)
};
