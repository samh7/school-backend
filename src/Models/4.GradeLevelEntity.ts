import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { Stream } from "./5.StreamEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

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
	@ManyToOne(() => School, (s) => s.GradeLevels, { onDelete: "CASCADE" })
	@JoinColumn({ name: "SchoolId" })
	School: School;

	@OneToMany(() => Stream, (s) => s.GradeLevel)
	Streams: Stream[];

	@OneToMany(() => GradeSubject, (gs) => gs.GradeLevel)
	GradeSubjects: GradeSubject[];
}
