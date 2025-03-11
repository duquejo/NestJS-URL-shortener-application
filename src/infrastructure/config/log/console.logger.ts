import { ConsoleLogger } from '@nestjs/common';

export class AppLogger extends ConsoleLogger {
  constructor() {
    super({
      prefix: 'ShortCo',
    });
  }
}
