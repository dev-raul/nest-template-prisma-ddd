import { Module } from '@nestjs/common';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';

import { BcryptEncryptorService } from './encryptor/bcrypt-encriptor-service';

@Module({
  providers: [
    {
      provide: EncryptorService,
      useClass: BcryptEncryptorService,
    },
  ],
  exports: [EncryptorService],
})
export class ServicesModule {}
