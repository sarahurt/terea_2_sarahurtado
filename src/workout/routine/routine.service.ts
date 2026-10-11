import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoutineNotFoundException } from '../../common/exceptions';
import { UserService } from '../../auth/user/user.service';
import { Routine } from '../entities/routine.entity';

import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutineService {
    constructor(
        @InjectRepository(Routine)
        private readonly routineRepository: Repository<Routine>,
        private readonly userService: UserService, // Viene de UserModule (que lo exporta)
    ) {}

    async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
        const { userId, ...routineData } = createRoutineDto;
        const user = await this.userService.findOne(userId); // Si no existe, lanza UserNotFoundException (404)

        const routine = this.routineRepository.create({
            ...routineData,
            user,
        });
        const savedRoutine = await this.routineRepository.save(routine);
        return this.findOne(savedRoutine.id); // Lo volvemos a buscar para no devolver el passwordHash del usuario
    }

    async findAll(): Promise<Routine[]> {
        return await this.routineRepository.find({
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: { id: true, username: true, email: true }, // Solo datos públicos del usuario
            },
            relations: { user: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Routine> {
        const routine = await this.routineRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: { id: true, username: true, email: true },
            },
            relations: {
                user: true,
                routineExercises: { exercise: true }, // Ejercicios planeados de la rutina
            },
            order: { routineExercises: { orderIndex: 'ASC' } },
        });
        if (!routine) {
            throw new RoutineNotFoundException(id);
        }
        return routine;
    }

    async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
        const { userId, ...routineData } = updateRoutineDto;
        await this.findOne(id); // Si no existe, lanza 404

        if (userId) {
            const user = await this.userService.findOne(userId);
            await this.routineRepository.update(id, { ...routineData, user, updatedAt: () => 'CURRENT_TIMESTAMP' });
        } else {
            await this.routineRepository.update(id, { ...routineData, updatedAt: () => 'CURRENT_TIMESTAMP' });
        }
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.routineRepository.delete(id); // Por el onDelete: 'CASCADE' se borran sus routine_exercises y activity_logs
    }
}
