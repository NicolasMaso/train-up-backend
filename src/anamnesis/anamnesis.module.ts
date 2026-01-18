import { Module } from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisController } from './anamnesis.controller';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [StudentsModule],
  controllers: [AnamnesisController],
  providers: [AnamnesisService],
  exports: [AnamnesisService],
})
export class AnamnesisModule {}
