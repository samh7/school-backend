import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { StudentSubjectAssignment } from "./student-subject-assignment.entity";
import { GradeLevel } from "./grade-level.entity";
import { Subject } from "./subject.entity";
import { SubjectTeacher } from "./subject-teacher.entity";

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
