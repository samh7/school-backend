import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { School } from "./1.SchoolEntity";
import { GradeSubject } from "./8.GradeSubjectEntity";

@Entity("subjects")
export class Subject extends MyBaseEntity {
	@Column()
	SchoolId: string;

	@Column()
	Name: string;

	@Column()
	Code: string;

	@Column()
	CbcLearningArea: string;

	@Column()
	LearningType: string;

	// Relations
	@ManyToOne(() => School, (s) => s.Subjects, { onDelete: "CASCADE" })
	@JoinColumn({ name: "SchoolId" })
	School: School;

	@OneToMany(() => GradeSubject, (gs) => gs.Subject)
	GradeSubjects: GradeSubject[];
}
