import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { School } from "./school.entity";
import { GradeSubject } from "./grade-subject.entity";

@Entity("subjects")
export class Subject extends MyBaseEntity {
	@Column()
	schoolId: string;

	@Column()
	name: string;

	@Column()
	code: string;

	@Column()
	cbcLearningArea: string;

	@Column()
	learningType: string;

	// Relations
	@ManyToOne(() => School, (s) => s.subjects, { onDelete: "CASCADE" })
	@JoinColumn({ name: "schoolId" })
	school: School;

	@OneToMany(() => GradeSubject, (gs) => gs.subject)
	gradeSubjects: GradeSubject[];
}
