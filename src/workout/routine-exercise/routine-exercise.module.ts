import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutineExercise } from '../entities/routine-exercise.entity';
import { RoutineModule } from '../routine/routine.module';
import { ExerciseModule } from '../exercise/exercise.module';

import { RoutineExerciseService } from './routine-exercise.service';
import { RoutineExerciseController } from './routine-exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoutineExercise]), RoutineModule, ExerciseModule],
    controllers: [RoutineExerciseController],
    providers: [RoutineExerciseService],
    exports: [RoutineExerciseService], // Lo usará ActivityExercise
})
export class RoutineExerciseModule {}
