const config = function config() {
  const configObj = {
    port: process.env.PORT || 8080,
    dbEndpoint: process.env.DB_ENDPOINT || 'postgres://postgres:password@localhost:5432/razerbank',
  };

  return configObj;
};

module.exports = config();
