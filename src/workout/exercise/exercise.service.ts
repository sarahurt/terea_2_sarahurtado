import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExerciseNotFoundException } from '../../common/exceptions';
import { Exercise } from '../entities/exercise.entity';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
    ) {}

    async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
        const exercise = this.exerciseRepository.create(createExerciseDto); // Solo crea el objeto en memoria
        return await this.exerciseRepository.save(exercise); // Ejecuta el INSERT
    }

    async findAll(): Promise<Exercise[]> {
        return await this.exerciseRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findOne({ where: { id } });
        if (!exercise) {
            throw new ExerciseNotFoundException(id);
        }
        return exercise;
    }

    async update(id: number, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
        await this.findOne(id); // Si no existe, lanza 404 antes de intentar actualizar
        await this.exerciseRepository.update(id, updateExerciseDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const exercise = await this.exerciseRepository.findOne({
            where: { id },
            relations: { routineExercises: true },
        });
        if (!exercise) {
            throw new ExerciseNotFoundException(id);
        }
        // No se puede borrar un ejercicio del catálogo si alguna rutina lo está usando
        if (exercise.routineExercises.length > 0) {
            throw new BadRequestException(
                `El ejercicio ${id} no se puede eliminar porque está siendo usado en ${exercise.routineExercises.length} rutina(s).`,
            );
        }
        await this.exerciseRepository.delete(id);
    }
}
