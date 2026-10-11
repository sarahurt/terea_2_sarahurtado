import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLog } from '../entities/activity-log.entity';
import { UserModule } from '../../auth/user/user.module';
import { RoutineModule } from '../routine/routine.module';

import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog]), UserModule, RoutineModule],
    controllers: [ActivityLogController],
    providers: [ActivityLogService],
    exports: [ActivityLogService], // Lo usará ActivityExercise
})
export class ActivityLogModule {}
