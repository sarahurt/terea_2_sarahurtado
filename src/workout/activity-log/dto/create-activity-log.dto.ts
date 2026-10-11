import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityLogDto {
    @IsNotEmpty({ message: 'Debe especificar el id del usuario que entrena' })
    userId: number;

    @IsNotEmpty({ message: 'Debe especificar el id de la rutina que se ejecuta' })
    routineId: number;

    @IsOptional() // Si no se envía, la base de datos pone la fecha actual
    startedAt?: Date;

    @IsOptional() // Si no se envía, la sesión queda "en curso" (null)
    completedAt?: Date;
}
