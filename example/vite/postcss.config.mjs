import path from 'path';

export default {
  plugins: {
    'cloudcss/postcss': {
      config: path.resolve('./cloud.config.cjs'),
    },
  },
};
