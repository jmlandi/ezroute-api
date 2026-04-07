import { Module } from '@nestjs/common';
import { LinkModule } from './modules/link/link.module';
import { RedirectModule } from './modules/redirect/redirect.module';

@Module({
  imports: [LinkModule, RedirectModule],
})
export class AppModule {}
