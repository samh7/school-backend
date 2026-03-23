import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { ClassTeacher } from "./10.ClassTeacherEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { GradeLevel } from "./4.GradeLevelEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

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
