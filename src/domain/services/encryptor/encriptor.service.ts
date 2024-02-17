import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class EncryptorService {
  abstract hash(password: string): Promise<string>;
  abstract compare(data: string, encryptedData: string): Promise<boolean>;
}
