import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ThrottlerGlobalModule = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => [{
    ttl: Number(configService.get('THROTTLE_TTL', 60)),
    limit: Number(configService.get('THROTTLE_LIMIT', 10)),
  }],
});
