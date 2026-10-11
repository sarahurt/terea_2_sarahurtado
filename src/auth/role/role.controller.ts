import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { RoleNotFoundException } from '../../common/exceptions';
import { PermissionsGuard } from '../guards/permissions/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // Todas las rutas de /roles requieren token y permisos
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_roles')
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_roles')
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_roles')
    async findOne(@Param('id', PositiveIntPipe) id: number) {
        const role = await this.roleService.findOne(id);
        if (!role) {
            throw new RoleNotFoundException(id); // El servicio devuelve null, aquí lo convertimos en 404
        }
        return role;
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_roles')
    async update(@Param('id', PositiveIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
        const role = await this.roleService.update(id, updateRoleDto);
        if (!role) {
            throw new RoleNotFoundException(id);
        }
        return role;
    }

    /**
     * Reemplaza por completo el conjunto de permisos asignados a este rol.
     * Body esperado: { "permissionIds": [1, 2, 3] }
     */
    @Patch(':id/permissions')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_roles')
    assignPermissions(
        @Param('id', PositiveIntPipe) id: number,
        @Body() assignRolePermissionsDto: AssignRolePermissionsDto,
    ) {
        return this.roleService.assignPermissions(id, assignRolePermissionsDto.permissionIds);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_roles')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        const result = await this.roleService.remove(id);
        if (!result) {
            throw new RoleNotFoundException(id);
        }
    }
}
