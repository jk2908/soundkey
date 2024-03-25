import MillionLint from '@million/lint'

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    //ppr: true,
  },
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  },
}

export default nextConfig
/*
export default MillionLint.next({
  rsc: true
})(nextConfig);*/
