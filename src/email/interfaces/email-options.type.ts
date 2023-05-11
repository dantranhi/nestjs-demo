import { ModuleMetadata } from '@nestjs/common';
import { EmailConfig } from './email-config.interface';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

type EmailAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<EmailConfig>, 'useFactory' | 'inject'>;

export default EmailAsyncOptions;
