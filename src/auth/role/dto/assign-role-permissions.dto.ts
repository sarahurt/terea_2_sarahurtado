import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

/**
 * DTO usado para reemplazar por completo el conjunto de permisos
 * asignados a un rol (PATCH /roles/:id/permissions).
 */
export class AssignRolePermissionsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    permissionIds: number[];
}
