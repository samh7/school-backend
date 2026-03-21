import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { GradeLevel } from "./4.GradeLevelEntity";
import { Subject } from "./6.SubjectEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

@Entity("grade_subjects")
export class GradeSubject extends MyBaseEntity {
	@Column()
	GradeLevelId: string;

	@Column()
	SubjectId: string;

	@Column({ default: true })
	IsExaminable: boolean;

	@Column()
	PeriodsPerWeek: number;

	// Relations
	@ManyToOne(() => GradeLevel, (gl) => gl.GradeSubjects)
	@JoinColumn({ name: 'GradeLevelId' })
	GradeLevel: GradeLevel;

	@ManyToOne(() => Subject, (s) => s.GradeSubjects)
	@JoinColumn({ name: 'SubjectId' })
	Subject: Subject;

	@OneToMany(() => SubjectTeacher, (st) => st.GradeSubject)
	SubjectTeachers: SubjectTeacher[];
}
