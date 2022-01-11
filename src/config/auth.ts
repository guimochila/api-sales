export default {
  jwt: {
    secret: process.env.JTW_SECRET || 'SET_A_VALID_TOKEN',
    expiresIn: '1d',
  },
}
