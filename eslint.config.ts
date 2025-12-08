import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginPrettier from 'eslint-plugin-prettier'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    name: 'app/prettier',
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  {
    name: 'app/disable-multi-word-component',
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    name: 'app/attribute-hyphenation',
    rules: {
      'vue/attribute-hyphenation': ['error', 'always']
    }
  },
  {
    name: 'app/no-unused-vars',
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }]
    }
  }
)
