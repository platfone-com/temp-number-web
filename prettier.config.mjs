import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const privatixPrettierConfig = require('privatix-prettier')

export default {
  ...privatixPrettierConfig,
  vueIndentScriptAndStyle: true,
  plugins: ['prettier-plugin-tailwindcss']
}
