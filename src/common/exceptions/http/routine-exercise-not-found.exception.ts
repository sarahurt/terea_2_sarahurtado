import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando un ejercicio de rutina no existe en la base de datos.
 */
export class RoutineExerciseNotFoundException extends NotFoundException {
    constructor(id: number) {
        super({
            error: 'Routine Exercise Not Found',
            message: `El ejercicio de rutina con identificador ${id} no fue encontrado.`,
        });
    }
}
