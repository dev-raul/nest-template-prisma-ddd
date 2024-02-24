// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

import NodeEnvironment from 'jest-environment-node';
import { exec } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as util from 'node:util';
import { Client } from 'pg';

import { HOST, NAME, PASSWORD, PORT, USER } from '../src/config/database';

const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private dbName: string;
  private connectionString: string;

  constructor(config: any, _context: any) {
    super(config, _context);

    this.schema = `test_${crypto.randomUUID()}`;
    this.dbName = NAME ?? `test_dbname_${crypto.randomUUID()}`;
    this.connectionString = `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${this.dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;
    process.env.DATABASE_NAME = this.dbName;
    this.global.process.env.DATABASE_NAME = this.dbName;

    await execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();

    return super.teardown();
  }
}
