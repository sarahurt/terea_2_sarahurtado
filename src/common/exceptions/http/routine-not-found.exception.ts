import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando una rutina no existe en la base de datos.
 */
export class RoutineNotFoundException extends NotFoundException {
    constructor(routineId: number) {
        super({
            error: 'Routine Not Found',
            message: `La rutina con identificador ${routineId} no fue encontrada.`,
        });
    }
}
