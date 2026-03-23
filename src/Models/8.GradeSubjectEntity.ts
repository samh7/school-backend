import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { StudentSubjectAssignment } from "./14.StudentSubjectAssignmentEntity";
import { GradeLevel } from "./4.GradeLevelEntity";
import { Subject } from "./6.SubjectEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

@Entity("grade_subjects")
export class GradeSubject extends MyBaseEntity {
	@Column()
	gradeLevelId: string;

	@Column()
	subjectId: string;

	@Column({ default: true })
	isExaminable: boolean;

	@Column()
	periodsPerWeek: number;

	// Relations
	@ManyToOne(() => GradeLevel, (gl) => gl.gradeSubjects, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "gradeLevelId" })
	gradeLevel: GradeLevel;

	@ManyToOne(() => Subject, (s) => s.gradeSubjects, { onDelete: "CASCADE" })
	@JoinColumn({ name: "subjectId" })
	subject: Subject;

	@OneToMany(() => SubjectTeacher, (st) => st.gradeSubject)
	subjectTeachers: SubjectTeacher[];

	@OneToMany(() => StudentSubjectAssignment, (ssa) => ssa.gradeSubject)
	studentAssignments: StudentSubjectAssignment[];
}
