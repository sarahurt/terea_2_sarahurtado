import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';

import { RoutineExercise } from './routine-exercise.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('routines') // Plan de entrenamiento creado por un usuario
export class Routine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Muchas rutinas pertenecen a un usuario. Si se borra el usuario, se borran sus rutinas
    @ManyToOne(() => User, (user) => user.routines, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Una rutina contiene muchos ejercicios planeados
    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
    routineExercises: RoutineExercise[];

    // Una rutina puede ejecutarse muchas veces (sesiones)
    @OneToMany(() => ActivityLog, (activityLog) => activityLog.routine)
    activityLogs: ActivityLog[];
}
