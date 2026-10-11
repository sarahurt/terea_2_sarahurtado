import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Exercise } from '../entities/exercise.entity';

import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise])], // Registra Repository<Exercise> en este módulo
    controllers: [ExerciseController],
    providers: [ExerciseService],
    exports: [ExerciseService], // Lo exportamos porque RoutineExercise lo va a necesitar
})
export class ExerciseModule {}
