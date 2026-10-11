import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../../auth/guards/permissions/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

import { RoutineExerciseService } from './routine-exercise.service';
import { CreateRoutineExerciseDto } from './dto/create-routine-exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine-exercise.dto';

@Controller('routine-exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // 1° valida el token (401), 2° valida los permisos (403)
export class RoutineExerciseController {
    constructor(private readonly routineExerciseService: RoutineExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_routine_exercise')
    create(@Body() createRoutineExerciseDto: CreateRoutineExerciseDto) {
        return this.routineExerciseService.create(createRoutineExerciseDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('read_routine_exercise')
    findAll() {
        return this.routineExerciseService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('read_routine_exercise')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.routineExerciseService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('update_routine_exercise')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateRoutineExerciseDto: UpdateRoutineExerciseDto) {
        return this.routineExerciseService.update(id, updateRoutineExerciseDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_routine_exercise')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.routineExerciseService.remove(id);
    }
}
