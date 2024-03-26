import MillionLint from '@million/lint'

const config = {
  reactStrictMode: true,
  experimental: {
    //ppr: true,
  },
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  },
}

export default config
/*
export default MillionLint.next({
  rsc: true
})(config);*/
