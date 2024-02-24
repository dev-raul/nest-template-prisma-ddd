import * as bcrypt from 'bcrypt';

import { BcryptEncryptorService } from './bcrypt-encriptor-service';

describe('BcryptEncryptorService', () => {
  it('should hash', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('1234-hash');
    const bcryptEncryptorService = new BcryptEncryptorService();

    expect(await bcryptEncryptorService.hash('1234')).toBe('1234-hash');
  });

  it('should compare', async () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(
        (value, hash) => value === '1234' && hash === '1234-hash',
      );
    const bcryptEncryptorService = new BcryptEncryptorService();

    expect(await bcryptEncryptorService.compare('1234', '1234-hash')).toBe(
      true,
    );
  });
});
