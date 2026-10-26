module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['fix', 'feat', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf']],
    'scope-enum': [
      2,
      'always',
      [
        // areas
        'main',
        'docs',
        'deps',
        'ci',
        'format',
        'git',
        'other',
        // packages
        'collection',
        'http',
        'jext',
      ],
    ],
  },
};
