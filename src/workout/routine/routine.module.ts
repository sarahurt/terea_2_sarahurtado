import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Routine } from '../entities/routine.entity';
import { UserModule } from '../../auth/user/user.module';

import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Routine]), UserModule], // UserModule nos da UserService
    controllers: [RoutineController],
    providers: [RoutineService],
    exports: [RoutineService], // Lo usarán RoutineExercise y ActivityLog
})
export class RoutineModule {}
