import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExerciseDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString({ message: 'El tipo debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El tipo de ejercicio es obligatorio' })
    @MaxLength(50)
    type!: string;

    @IsOptional()
    estimatedCalories?: number;

    @IsOptional()
    estimatedDistanceKm?: number;

    @IsOptional()
    estimatedDurationMin?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    icon?: string;
}
