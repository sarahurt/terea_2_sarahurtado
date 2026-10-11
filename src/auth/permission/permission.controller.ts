import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionNotFoundException } from '../../common/exceptions';
import { PermissionsGuard } from '../guards/permissions/permissions.guard';
import { Permissions } from '../decorators/permissions.decorator';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // Todas las rutas de /permissions requieren token y permisos
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('manage_permissions')
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_permissions')
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_permissions')
    async findOne(@Param('id', PositiveIntPipe) id: number) {
        const permission = await this.permissionService.findOne(id);
        if (!permission) {
            throw new PermissionNotFoundException(id); // El servicio devuelve null, aquí lo convertimos en 404
        }
        return permission;
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('manage_permissions')
    async update(@Param('id', PositiveIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        const permission = await this.permissionService.update(id, updatePermissionDto);
        if (!permission) {
            throw new PermissionNotFoundException(id);
        }
        return permission;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('manage_permissions')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        const result = await this.permissionService.remove(id);
        if (!result) {
            throw new PermissionNotFoundException(id);
        }
    }
}
