import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./base.entity";
import { ClassTeacher } from "./class-teacher.entity";
import { StudentEnrollment } from "./student-enrollment.entity";
import { GradeLevel } from "./grade-level.entity";
import { SubjectTeacher } from "./subject-teacher.entity";

@Entity("streams")
export class Stream extends MyBaseEntity {
	@Column()
	gradeLevelId: string;

	@Column()
	name: string;

	@Column()
	capacity: number;

	// Relations
	@ManyToOne(() => GradeLevel, (gl) => gl.streams, { onDelete: "CASCADE" })
	@JoinColumn({ name: "gradeLevelId" })
	gradeLevel: GradeLevel;

	@OneToMany(() => StudentEnrollment, (e) => e.stream)
	enrollments: StudentEnrollment[];

	@OneToMany(() => ClassTeacher, (ct) => ct.stream)
	classTeachers: ClassTeacher[];

	@OneToMany(() => SubjectTeacher, (st) => st.stream)
	subjectTeachers: SubjectTeacher[];
}
