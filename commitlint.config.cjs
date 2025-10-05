/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
  // 拡張: 長めの説明的ヘッダーを許容するため 50 -> 100 に拡大
  'header-max-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'lower-case']],
    'subject-full-stop': [2, 'never', '.']
  }
};
