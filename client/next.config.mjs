/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions:['ts','tsx'],
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/*/**',
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '**',
          }
        ],
      },
};

export default nextConfig;
