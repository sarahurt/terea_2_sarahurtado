import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando un ejercicio no existe en la base de datos.
 */
export class ExerciseNotFoundException extends NotFoundException {
    constructor(exerciseId: number) {
        super({
            error: 'Exercise Not Found',
            message: `El ejercicio con identificador ${exerciseId} no fue encontrado.`,
        });
    }
}
