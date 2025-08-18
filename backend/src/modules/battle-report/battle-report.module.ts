import { Module } from '@nestjs/common';
import { BattleReportController } from './battle-report.controller';
import { BattleReportService } from './battle-report.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BattleReportController],
  providers: [BattleReportService],
  exports: [BattleReportService],
})
export class BattleReportModule {} 