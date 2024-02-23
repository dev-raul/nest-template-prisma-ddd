import jestConfig from '../jest.config';

const config: any = {
  ...jestConfig,
  testEnvironment: './prisma/prisma-test-environment.ts',
  rootDir: '../',
  testRegex: '.e2e-spec.ts$',
};

export default config;
