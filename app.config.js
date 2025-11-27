import 'dotenv/config';

module.exports = ({ config }) => {
  console.log(config.name); // prints 'My App'

  return {
    ...config,
    android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
  };
};
