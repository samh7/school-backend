import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MyBaseEntity } from "./0.base_entity";
import { ClassTeacher } from "./10.class_teacher";
import { StudentEnrollment } from "./12.student_enrollment";
import { GradeLevel } from "./4.grade_level";
import { SubjectTeacher } from "./9.subject_teacher";

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
