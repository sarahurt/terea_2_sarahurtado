import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoutineExerciseDto {
    @IsNotEmpty({ message: 'Debe especificar el id de la rutina' })
    routineId: number;

    @IsNotEmpty({ message: 'Debe especificar el id del ejercicio' })
    exerciseId: number;

    @IsNotEmpty({ message: 'Debe especificar la posición del ejercicio en la rutina' })
    orderIndex: number;

    @IsOptional()
    targetSets?: number;

    @IsOptional()
    targetReps?: number;

    @IsOptional()
    targetWeightKg?: number;

    @IsOptional()
    targetDurationMin?: number;
}
