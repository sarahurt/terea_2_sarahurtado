import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoutineExercise } from './routine-exercise.entity';

@Entity('exercises') // Tabla del catálogo de ejercicios
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 50 }) // Ej: 'strength', 'cardio', 'core' (string simple, sin enum)
    type: string;

    @Column({ name: 'estimated_calories', type: 'float', nullable: true })
    estimatedCalories: number;

    @Column({ name: 'estimated_distance_km', type: 'float', nullable: true })
    estimatedDistanceKm: number;

    @Column({ name: 'estimated_duration_min', type: 'int', nullable: true })
    estimatedDurationMin: number;

    @Column({ length: 255, nullable: true })
    icon: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Un ejercicio puede usarse en muchas rutinas (a través de routine_exercises)
    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises: RoutineExercise[];
}
