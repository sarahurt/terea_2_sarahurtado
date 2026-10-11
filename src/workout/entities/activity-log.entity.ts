import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../auth/entities/user.entity';

import { Routine } from './routine.entity';
import { ActivityExercise } from './activity-exercise.entity';

@Entity('activity_logs') // Sesión de entrenamiento: un usuario ejecuta una rutina
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startedAt!: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true }) // null = sesión en curso
    completedAt!: Date;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.activityLogs, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Routine, (routine) => routine.activityLogs, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_id' })
    routine!: Routine;

    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.activityLog)
    activityExercises!: ActivityExercise[];
}
