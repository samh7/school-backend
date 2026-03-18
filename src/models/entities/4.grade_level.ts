import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { School } from "./1.school";
import { Stream } from "./5.stream";
import { GradeSubject } from "./8.grade_subject";

@Entity("grade_levels")
export class GradeLevel extends MyBaseEntity {
	@Column()
	SchoolId: string;

	@Column()
	Name: string;

	@Column()
	CbcLevel: string;

	@Column()
	SortOrder: number;

	// Relations
	@ManyToOne(() => School, (s) => s.GradeLevels)
	@JoinColumn({ name: 'SchoolId' })
	School: School;

	@OneToMany(() => Stream, (s) => s.GradeLevel)
	Streams: Stream[];

	@OneToMany(() => GradeSubject, (gs) => gs.GradeLevel)
	GradeSubjects: GradeSubject[];
}
