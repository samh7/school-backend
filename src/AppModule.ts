import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./Auth/AuthModule";
import { EnvironmentVariables } from "./Config/EnvTypes";
import { SchoolModule } from "./Controllers/1.SchoolModule";
import { StudentEnrollmentModule } from "./Controllers/10.StudentEnrollmentModule";
import { StaffModule } from "./Controllers/11.StaffModule";
import { ClassTeacherModule } from "./Controllers/12.ClassTeacherModule";
import { SubjectTeacherModule } from "./Controllers/13.SubjectTeacherModule";
import { AcademicYearModule } from "./Controllers/2.AcademicYearModule";
import { TermModule } from "./Controllers/3.TermModule";
import { GradeLevelModule } from "./Controllers/4.GradeLevelModule";
import { StreamModule } from "./Controllers/5.StreamModule";
import { SubjectModule } from "./Controllers/6.SubjectModule";
import { GradeSubjectModule } from "./Controllers/7.GradeSubjectModule";
import { UserAccountModule } from "./Controllers/8.UserAccountModule";
import { StudentModule } from "./Controllers/9.StudentModule";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
          type: 'better-sqlite3',
          database: config.getOrThrow("DATABASE_URL"),
          entities: [__dirname + '/**/*Entity.{ts,js}'],
          synchronize: config.getOrThrow("NODE_ENV") !== 'production',
        }),
        inject: [ConfigService]
      }
    ),

    AuthModule,
    SchoolModule,
    AcademicYearModule,
    TermModule,
    GradeLevelModule,
    StreamModule,
    SubjectModule,
    GradeSubjectModule,
    UserAccountModule,
    StudentModule,
    StudentEnrollmentModule,
    StaffModule,
    ClassTeacherModule,
    SubjectTeacherModule,
  ],
  controllers: [],
  // providers: [JwtStrategy],
})
export class AppModule { }
