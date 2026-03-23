import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { StudentSubjectAssignment } from "./14.StudentSubjectAssignmentEntity";
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
	@ManyToOne(() => GradeLevel, (gl) => gl.GradeSubjects, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "GradeLevelId" })
	GradeLevel: GradeLevel;

	@ManyToOne(() => Subject, (s) => s.GradeSubjects, { onDelete: "CASCADE" })
	@JoinColumn({ name: "SubjectId" })
	Subject: Subject;

	@OneToMany(() => SubjectTeacher, (st) => st.GradeSubject)
	SubjectTeachers: SubjectTeacher[];

	@OneToMany(() => StudentSubjectAssignment, (ssa) => ssa.GradeSubject)
	StudentAssignments: StudentSubjectAssignment[];
}
