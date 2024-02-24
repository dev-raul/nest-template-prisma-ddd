import jestConfig from '../jest.config';

const config: any = {
  ...jestConfig,
  testEnvironment: './prisma/prisma-test-environment.ts',
  rootDir: '../',
  collectCoverageFrom: [...jestConfig.collectCoverageFrom, '!src/**/*.spec.ts'],
  testRegex: '.e2e-spec.ts$',
};

export default config;
