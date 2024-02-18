import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';

@Injectable()
export class BcryptEncryptorService implements EncryptorService {
  async hash(password: string, salt = 5): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async compare(data: string, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }
}
