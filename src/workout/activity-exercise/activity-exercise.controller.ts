import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PositiveIntPipe } from '../../common/pipes/positive-int-pipe';
import { PermissionsGuard } from '../../auth/guards/permissions/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';

import { ActivityExerciseService } from './activity-exercise.service';
import { CreateActivityExerciseDto } from './dto/create-activity-exercise.dto';
import { UpdateActivityExerciseDto } from './dto/update-activity-exercise.dto';

@Controller('activity-exercises')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // 1° valida el token (401), 2° valida los permisos (403)
export class ActivityExerciseController {
    constructor(private readonly activityExerciseService: ActivityExerciseService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_activity_exercise')
    create(@Body() createActivityExerciseDto: CreateActivityExerciseDto) {
        return this.activityExerciseService.create(createActivityExerciseDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_exercise')
    findAll() {
        return this.activityExerciseService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('read_activity_exercise')
    findOne(@Param('id', PositiveIntPipe) id: number) {
        return this.activityExerciseService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Permissions('update_activity_exercise')
    update(@Param('id', PositiveIntPipe) id: number, @Body() updateActivityExerciseDto: UpdateActivityExerciseDto) {
        return this.activityExerciseService.update(id, updateActivityExerciseDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_activity_exercise')
    async remove(@Param('id', PositiveIntPipe) id: number) {
        await this.activityExerciseService.remove(id);
    }
}
