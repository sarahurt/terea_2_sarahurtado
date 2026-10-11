import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoutineDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty({ message: 'Debe especificar el id del usuario dueño de la rutina' })
    userId!: number;
}
