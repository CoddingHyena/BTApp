import { PartialType } from '@nestjs/mapped-types';
import { CreateBattleReportDto } from './create-battle-report.dto';

export class UpdateBattleReportDto extends PartialType(CreateBattleReportDto) {} 