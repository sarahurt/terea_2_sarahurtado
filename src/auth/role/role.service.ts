import { Injectable } from '@nestjs/common';
import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleNotFoundException, PermissionNotFoundException } from '../../common/exceptions';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Permission } from '../entities/permission.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const newRole = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(newRole);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleRepository.find();
    }

    async findOne(id: number): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id });
    }

    async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
        await this.roleRepository.update(id, updateRoleDto);
        return await this.roleRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<{ id: number } | null> {
        const result = await this.roleRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    /**
     * Retorna todos los roles junto con su listado de usuarios asociados.
     * Utiliza find() con carga de relaciones.
     */
    async findAllWithUsers(): Promise<Role[]> {
        return await this.roleRepository.find({
            relations: {
                users: true,
            },
            order: {
                name: 'ASC',
            },
        });
    }

    /**
     * Retorna un rol con todos sus permisos anidados
     * a través de la relación rolePermissions -> permission.
     */
    async findOneWithPermissions(id: number): Promise<Role | null> {
        return await this.roleRepository.findOne({
            where: { id },
            relations: {
                rolePermissions: {
                    permission: true,
                },
            },
        });
    }

    /**
     * Busca roles cuyo nombre contenga un texto parcial (insensible a mayúsculas/minúsculas).
     * Utiliza ILike dentro de find().
     */
    async searchByName(term: string): Promise<Role[]> {
        return await this.roleRepository.find({
            where: {
                name: ILike(`%${term}%`),
            },
            order: {
                name: 'ASC',
            },
        });
    }

    /**
     * Reemplaza por completo el conjunto de permisos asignados a un rol
     * (PATCH /roles/:id/permissions). Valida que el rol y todos los
     * permisos recibidos existan antes de aplicar el cambio, borra las
     * asignaciones previas y crea las nuevas en su lugar.
     */
    async assignPermissions(roleId: number, permissionIds: number[]): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ id: roleId });
        if (!role) {
            throw new RoleNotFoundException(roleId);
        }

        const uniqueIds = [...new Set(permissionIds)];
        const permissions = await this.permissionRepository.findBy({ id: In(uniqueIds) });
        if (permissions.length !== uniqueIds.length) {
            const foundIds = permissions.map((permission) => permission.id);
            const missingIds = uniqueIds.filter((id) => !foundIds.includes(id));
            throw new PermissionNotFoundException(missingIds.join(', '));
        }

        // Se eliminan las asignaciones previas de este rol y se crean las nuevas
        await this.rolePermissionRepository.delete({ role: { id: roleId } });
        const newRolePermissions = permissions.map((permission) =>
            this.rolePermissionRepository.create({ role, permission }),
        );
        await this.rolePermissionRepository.save(newRolePermissions);

        return (await this.findOneWithPermissions(roleId))!;
    }
}
