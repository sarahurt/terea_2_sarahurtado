import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityLogNotFoundException } from '../../common/exceptions';
import { UserService } from '../../auth/user/user.service';
import { ActivityLog } from '../entities/activity-log.entity';
import { RoutineService } from '../routine/routine.service';

import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectRepository(ActivityLog)
        private readonly activityLogRepository: Repository<ActivityLog>,
        private readonly userService: UserService,
        private readonly routineService: RoutineService,
    ) {}

    async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
        const { userId, routineId, ...activityLogData } = createActivityLogDto;
        const user = await this.userService.findOne(userId); // 404 si el usuario no existe
        const routine = await this.routineService.findOne(routineId); // 404 si la rutina no existe

        const activityLog = this.activityLogRepository.create({
            ...activityLogData,
            user,
            routine,
        });
        const saved = await this.activityLogRepository.save(activityLog);
        return this.findOne(saved.id); // Lo volvemos a buscar para no devolver el passwordHash del usuario
    }

    async findAll(): Promise<ActivityLog[]> {
        return await this.activityLogRepository.find({
            select: {
                id: true,
                startedAt: true,
                completedAt: true,
                createdAt: true,
                user: { id: true, username: true, email: true }, // Solo datos públicos del usuario
            },
            relations: { user: true, routine: true },
            order: { startedAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<ActivityLog> {
        const activityLog = await this.activityLogRepository.findOne({
            where: { id },
            select: {
                id: true,
                startedAt: true,
                completedAt: true,
                createdAt: true,
                user: { id: true, username: true, email: true },
            },
            relations: {
                user: true,
                routine: true,
                activityExercises: { routineExercise: { exercise: true } }, // Lo que realmente hizo en la sesión
            },
        });
        if (!activityLog) {
            throw new ActivityLogNotFoundException(id);
        }
        return activityLog;
    }

    async update(id: number, updateActivityLogDto: UpdateActivityLogDto): Promise<ActivityLog> {
        const { userId, routineId, ...activityLogData } = updateActivityLogDto;
        await this.findOne(id); // 404 si no existe

        if (userId) {
            const user = await this.userService.findOne(userId);
            await this.activityLogRepository.update(id, { user });
        }
        if (routineId) {
            const routine = await this.routineService.findOne(routineId);
            await this.activityLogRepository.update(id, { routine });
        }
        if (Object.keys(activityLogData).length > 0) {
            await this.activityLogRepository.update(id, activityLogData);
        }
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.activityLogRepository.delete(id); // Por el onDelete: 'CASCADE' se borran sus activity_exercises
    }
}
