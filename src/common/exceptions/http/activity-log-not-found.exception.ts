import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando una sesión de entrenamiento no existe en la base de datos.
 */
export class ActivityLogNotFoundException extends NotFoundException {
    constructor(id: number) {
        super({
            error: 'Activity Log Not Found',
            message: `La sesión de entrenamiento con identificador ${id} no fue encontrada.`,
        });
    }
}
