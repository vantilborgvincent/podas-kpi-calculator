/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
import Image from 'next/image';
// Then in your component:
<Image src="/podds-logo.png" alt="Podds Logo" width={240} height={80} />

