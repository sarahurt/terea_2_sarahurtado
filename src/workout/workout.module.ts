import { Module } from '@nestjs/common';

import { ExerciseModule } from './exercise/exercise.module';
import { RoutineModule } from './routine/routine.module';
import { RoutineExerciseModule } from './routine-exercise/routine-exercise.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ActivityExerciseModule } from './activity-exercise/activity-exercise.module';

@Module({
    imports: [ExerciseModule, RoutineModule, RoutineExerciseModule, ActivityLogModule, ActivityExerciseModule],
})
export class WorkoutModule {}
