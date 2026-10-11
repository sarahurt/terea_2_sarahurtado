import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Routine } from './routine.entity';
import { Exercise } from './exercise.entity';
import { ActivityExercise } from './activity-exercise.entity';

@Entity('routine_exercises') // Tabla puente entre routines y exercises, con los valores PLANEADOS
export class RoutineExercise {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'order_index', type: 'int' }) // Posición del ejercicio dentro de la rutina
    orderIndex!: number;

    @Column({ name: 'target_sets', type: 'int', nullable: true })
    targetSets!: number;

    @Column({ name: 'target_reps', type: 'int', nullable: true })
    targetReps!: number;

    @Column({ name: 'target_weight_kg', type: 'float', nullable: true })
    targetWeightKg!: number;

    @Column({ name: 'target_duration_min', type: 'int', nullable: true })
    targetDurationMin!: number;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @ManyToOne(() => Routine, (routine) => routine.routineExercises, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_id' })
    routine!: Routine;

    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises, { nullable: false })
    @JoinColumn({ name: 'exercise_id' })
    exercise!: Exercise;

    // Lo que realmente se hizo de este ejercicio en cada sesión
    @OneToMany(() => ActivityExercise, (activityExercise) => activityExercise.routineExercise)
    activityExercises!: ActivityExercise[];
}
