import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.BaseEntity";
import { ClassTeacher } from "./10.ClassTeacherEntity";
import { StudentEnrollment } from "./12.StudentEnrollmentEntity";
import { GradeLevel } from "./4.GradeLevelEntity";
import { SubjectTeacher } from "./9.SubjectTeacherEntity";

@Entity("streams")
export class Stream extends MyBaseEntity {
	@Column()
	GradeLevelId: string;

	@Column()
	Name: string;

	@Column()
	Capacity: number;

	// Relations
	@ManyToOne(() => GradeLevel, (gl) => gl.Streams)
	@JoinColumn({ name: 'GradeLevelId' })
	GradeLevel: GradeLevel;

	@OneToMany(() => StudentEnrollment, (e) => e.Stream)
	Enrollments: StudentEnrollment[];

	@OneToMany(() => ClassTeacher, (ct) => ct.Stream)
	ClassTeachers: ClassTeacher[];

	@OneToMany(() => SubjectTeacher, (st) => st.Stream)
	SubjectTeachers: SubjectTeacher[];
}
