import { NotFoundException } from '@nestjs/common';

/**
 * Excepción personalizada lanzada cuando un permiso solicitado no existe.
 */
export class PermissionNotFoundException extends NotFoundException {
    constructor(permissionIdOrName: number | string) {
        super({
            error: 'Permission Not Found',
            message: `El permiso con identificador o nombre '${permissionIdOrName}' no existe en el sistema.`,
        });
    }
}
