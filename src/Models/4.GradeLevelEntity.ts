import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { Stream } from "./5.StreamEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

@Entity("grade_levels")
export class GradeLevel extends MyBaseEntity {
	@Column()
	schoolId: string;

	@Column()
	name: string;

	@Column()
	cbcLevel: string;

	@Column()
	sortOrder: number;

	// Relations
	@ManyToOne(() => School, (s) => s.gradeLevels, { onDelete: "CASCADE" })
	@JoinColumn({ name: "schoolId" })
	school: School;

	@OneToMany(() => Stream, (s) => s.gradeLevel)
	streams: Stream[];

	@OneToMany(() => GradeSubject, (gs) => gs.gradeLevel)
	gradeSubjects: GradeSubject[];
}
