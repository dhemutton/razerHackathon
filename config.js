const config = function config() {
  const configObj = {
    port: process.env.PORT || 8080,
    dbEndpoint: process.env.DB_ENDPOINT || 'postgres://postgres:postgres@localhost:5432/razerBank',
  };

  return configObj;
};

module.exports = config();
