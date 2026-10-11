import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando un ejercicio realizado no existe en la base de datos.
 */
export class ActivityExerciseNotFoundException extends NotFoundException {
    constructor(id: number) {
        super({
            error: 'Activity Exercise Not Found',
            message: `El ejercicio realizado con identificador ${id} no fue encontrado.`,
        });
    }
}
