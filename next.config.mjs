const config = {
  reactStrictMode: false, // temp fix to get Framer Motion working in dev
  experimental: {
    reactCompiler: true
  },
  webpack(config) {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  },
}

export default config
