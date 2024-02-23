import { Prisma, PrismaClient } from '@prisma/client';
import NodeEnvironment from 'jest-environment-node';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { HOST, PASSWORD, PORT, USER, NAME } from '../src/config/database';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '.env.test' });

const execSync = promisify(exec);
const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;
  private client: PrismaClient;

  constructor(config: any, _context: any) {
    super(config, _context);

    this.schema = `${NAME}_test`;
    this.connectionString = `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${this.schema}`;
    this.client = new PrismaClient({
      log: ['query'],
      datasourceUrl: this.connectionString,
    });
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${prismaBinary} migrate dev`);

    const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);
    await Promise.all(
      modelNames.map((modelName) =>
        this.client[modelName.toLowerCase()].deleteMany(),
      ),
    );

    return super.setup();
  }

  async teardown() {
    return super.teardown();
  }
}
