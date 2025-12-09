import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
  }
});
