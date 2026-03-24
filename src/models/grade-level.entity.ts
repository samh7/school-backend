import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { School } from "./school.entity";
import { Stream } from "./stream.entity";
import { GradeSubject } from "./grade-subject.entity";

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
