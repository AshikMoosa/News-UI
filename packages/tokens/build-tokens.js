import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'css/theme-dark',
  format: ({ dictionary }) => {
    const declarations = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.value ?? token.$value};`)
      .join('\n');

    return [
      `[data-theme='dark'] {`,
      declarations,
      `}`,
      '',
      `@media (prefers-color-scheme: dark) {`,
      `  :root:not([data-theme='light']) {`,
      declarations.replace(/^ {2}/gm, '    '),
      `  }`,
      `}`,
      '',
    ].join('\n');
  },
});

const base = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      prefix: 'news',
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
      ],
    },
    js: {
      prefix: 'news',
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
});

const dark = new StyleDictionary({
  include: ['tokens/**/*.json'],
  source: ['themes/dark.json'],
  platforms: {
    css: {
      prefix: 'news',
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.dark.css',
          format: 'css/theme-dark',
          filter: (token) => token.filePath === 'themes/dark.json',
        },
      ],
    },
  },
});

await base.buildAllPlatforms();
await dark.buildAllPlatforms();
