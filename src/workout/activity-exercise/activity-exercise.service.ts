import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityExerciseNotFoundException } from '../../common/exceptions';
import { ActivityExercise } from '../entities/activity-exercise.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { RoutineExercise } from '../entities/routine-exercise.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { RoutineExerciseService } from '../routine-exercise/routine-exercise.service';

import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Injectable()
export class ActivityExerciseService {
    constructor(
        @InjectRepository(ActivityExercise)
        private readonly activityExerciseRepository: Repository<ActivityExercise>,
        private readonly activityLogService: ActivityLogService,
        private readonly routineExerciseService: RoutineExerciseService,
    ) {}

    /**
     * Regla de negocio: el ejercicio realizado debe pertenecer a la rutina que se está ejecutando en la sesión.
     */
    private validateSameRoutine(activityLog: ActivityLog, routineExercise: RoutineExercise): void {
        if (activityLog.routine.id !== routineExercise.routine.id) {
            throw new BadRequestException(
                `El ejercicio de rutina ${routineExercise.id} no pertenece a la rutina de la sesión ${activityLog.id}.`,
            );
        }
    }

    async create(createActivityExerciseDto: CreateActivityExerciseDto): Promise<ActivityExercise> {
        const { activityLogId, routineExerciseId, ...activityExerciseData } = createActivityExerciseDto;
        const activityLog = await this.activityLogService.findOne(activityLogId); // 404 si no existe
        const routineExercise = await this.routineExerciseService.findOne(routineExerciseId); // 404 si no existe
        this.validateSameRoutine(activityLog, routineExercise); // 400 si no coinciden

        const activityExercise = this.activityExerciseRepository.create({
            ...activityExerciseData,
            activityLog,
            routineExercise,
        });
        const saved = await this.activityExerciseRepository.save(activityExercise);
        return this.findOne(saved.id);
    }

    async findAll(): Promise<ActivityExercise[]> {
        return await this.activityExerciseRepository.find({
            relations: { activityLog: true, routineExercise: { exercise: true } },
            order: { activityLog: { id: 'ASC' }, id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<ActivityExercise> {
        const activityExercise = await this.activityExerciseRepository.findOne({
            where: { id },
            relations: { activityLog: true, routineExercise: { exercise: true } },
        });
        if (!activityExercise) {
            throw new ActivityExerciseNotFoundException(id);
        }
        return activityExercise;
    }

    async update(id: number, updateActivityExerciseDto: UpdateActivityExerciseDto): Promise<ActivityExercise> {
        const { activityLogId, routineExerciseId, ...activityExerciseData } = updateActivityExerciseDto;
        const activityExercise = await this.findOne(id); // 404 si no existe

        // Si cambian la sesión o el ejercicio de rutina, validamos que existan y que sigan siendo de la misma rutina
        if (activityLogId || routineExerciseId) {
            const activityLog = await this.activityLogService.findOne(activityLogId ?? activityExercise.activityLog.id);
            const routineExercise = await this.routineExerciseService.findOne(
                routineExerciseId ?? activityExercise.routineExercise.id,
            );
            this.validateSameRoutine(activityLog, routineExercise);
            activityExercise.activityLog = activityLog;
            activityExercise.routineExercise = routineExercise;
        }

        await this.activityExerciseRepository.save({ ...activityExercise, ...activityExerciseData });
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.activityExerciseRepository.delete(id);
    }
}
