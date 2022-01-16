/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/poll/0',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
