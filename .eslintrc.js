module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/', 'coverage/'],
  rules: {
    // Basic ESLint rules that work well
    'no-console': 'off', // Allow console.log in our demos
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off', // Turn off to avoid conflicts with TypeScript
    
    // Simple TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about 'any' types
    '@typescript-eslint/no-var-requires': 'off' // Allow require() statements
  }
}; 