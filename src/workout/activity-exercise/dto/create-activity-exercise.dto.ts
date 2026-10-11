import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityExerciseDto {
    @IsNotEmpty({ message: 'Debe especificar el id de la sesión de entrenamiento' })
    activityLogId: number;

    @IsNotEmpty({ message: 'Debe especificar el id del ejercicio de la rutina' })
    routineExerciseId: number;

    @IsOptional()
    actualSets?: number;

    @IsOptional()
    actualReps?: number;

    @IsOptional()
    actualWeightKg?: number;

    @IsOptional()
    actualDurationMin?: number;

    @IsOptional()
    caloriesBurned?: number;

    @IsOptional()
    distanceCoveredKm?: number;

    @IsOptional()
    startedAt?: Date;

    @IsOptional()
    completedAt?: Date;
}
