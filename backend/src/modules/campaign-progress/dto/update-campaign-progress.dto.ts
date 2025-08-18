import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignProgressDto } from './create-campaign-progress.dto';

export class UpdateCampaignProgressDto extends PartialType(CreateCampaignProgressDto) {} 