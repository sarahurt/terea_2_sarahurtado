import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoutineExerciseNotFoundException } from '../../common/exceptions';
import { RoutineExercise } from '../entities/routine-exercise.entity';
import { RoutineService } from '../routine/routine.service';
import { ExerciseService } from '../exercise/exercise.service';

import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Injectable()
export class RoutineExerciseService {
    constructor(
        @InjectRepository(RoutineExercise)
        private readonly routineExerciseRepository: Repository<RoutineExercise>,
        private readonly routineService: RoutineService,
        private readonly exerciseService: ExerciseService,
    ) {}

    async create(createRoutineExerciseDto: CreateRoutineExerciseDto): Promise<RoutineExercise> {
        const { routineId, exerciseId, ...routineExerciseData } = createRoutineExerciseDto;
        const routine = await this.routineService.findOne(routineId); // 404 si la rutina no existe
        const exercise = await this.exerciseService.findOne(exerciseId); // 404 si el ejercicio no existe

        const routineExercise = this.routineExerciseRepository.create({
            ...routineExerciseData,
            routine,
            exercise,
        });
        const saved = await this.routineExerciseRepository.save(routineExercise);
        return this.findOne(saved.id);
    }

    async findAll(): Promise<RoutineExercise[]> {
        return await this.routineExerciseRepository.find({
            relations: { routine: true, exercise: true },
            order: { routine: { id: 'ASC' }, orderIndex: 'ASC' },
        });
    }

    async findOne(id: number): Promise<RoutineExercise> {
        const routineExercise = await this.routineExerciseRepository.findOne({
            where: { id },
            relations: { routine: true, exercise: true },
        });
        if (!routineExercise) {
            throw new RoutineExerciseNotFoundException(id);
        }
        return routineExercise;
    }

    async update(id: number, updateRoutineExerciseDto: UpdateRoutineExerciseDto): Promise<RoutineExercise> {
        const { routineId, exerciseId, ...routineExerciseData } = updateRoutineExerciseDto;
        const routineExercise = await this.findOne(id); // 404 si no existe

        // Si mandan un nuevo routineId o exerciseId, validamos que existan y los reemplazamos
        if (routineId) {
            routineExercise.routine = await this.routineService.findOne(routineId);
        }
        if (exerciseId) {
            routineExercise.exercise = await this.exerciseService.findOne(exerciseId);
        }

        await this.routineExerciseRepository.save({ ...routineExercise, ...routineExerciseData });
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.routineExerciseRepository.delete(id);
    }
}
