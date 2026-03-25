import { getRedisConnectionToken, RedisModule } from "@nestjs-modules/ioredis";
import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import {
	minutes,
	seconds,
	ThrottlerGuard,
	ThrottlerModule,
} from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import Redis from "ioredis";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt.guard";
import { RolesGuard } from "./auth/role.guard";
import { BlockedIpMiddleware } from "./common/blocked-ip.middleware";
import { BlockedUserGuard } from "./common/blocked-users";
import { GeoBlockMiddleware } from "./common/geo-blocking";
import { IAuthenticatedRequest } from "./common/global-exception.filter";
import { HoneypotMiddleware } from "./common/honey-pot";
import { IEnvironmentVariables } from "./config/env-types";
import { AcademicYearModule } from "./controllers/academic-year.module";
import { ClassTeacherModule } from "./controllers/class-teacher.module";
import { GradeLevelModule } from "./controllers/grade-level.module";
import { GradeSubjectModule } from "./controllers/grade-subject.module";
import { SchoolModule } from "./controllers/school.module";
import { StaffModule } from "./controllers/staff.module";
import { StreamModule } from "./controllers/stream.module";
import { StudentEnrollmentModule } from "./controllers/student-enrollment.module";
import { StudentSubjectAssignmentModule } from "./controllers/student-subject-assignment.module";
import { StudentModule } from "./controllers/student.module";
import { SubjectTeacherModule } from "./controllers/subject-teacher.module";
import { SubjectModule } from "./controllers/subject.module";
import { TermModule } from "./controllers/term.module";
import { UserAccountModule } from "./controllers/user-account.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService<IEnvironmentVariables, true>) => ({
				type: "better-sqlite3",
				database: config.getOrThrow("DATABASE_URL"),
				entities: [__dirname + "/**/*Entity.{ts,js}"],
				synchronize: config.getOrThrow("NODE_ENV") !== "production",
				namingStrategy: new SnakeNamingStrategy(),
			}),
			inject: [ConfigService],
		}),

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
		StudentSubjectAssignmentModule,
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				type: "single",
				options: {
					host: config.getOrThrow<string>("REDIS_HOST"),
					port: config.getOrThrow<number>("REDIS_PORT"),
					password: config.getOrThrow<string>("REDIS_PASSWORD"),
					db: config.getOrThrow<number>("REDIS_DB"),
					lazyConnect: false,
					maxRetriesPerRequest: 3,
					enableOfflineQueue: false,
				},
			}),
			inject: [ConfigService],
		}),
		ThrottlerModule.forRootAsync({
			imports: [RedisModule],
			inject: [getRedisConnectionToken()],
			useFactory: (redis: Redis) => ({
				throttlers: [
					{
						name: "short",
						limit: 100,
						ttl: seconds(4),
						blockDuration: minutes(10),
					},
					{ name: "medium", limit: 500, ttl: seconds(30) },
					{ name: "long", limit: 2000, ttl: seconds(80) },
				],
				errorMessage: "Too many requests. Try again later.",
				storage: new ThrottlerStorageRedisService(redis),
				getTracker: (req: IAuthenticatedRequest) => {
					if (req.user?.id) return `user:${req.user.id}`;

					const forwarded = req.headers["x-forwarded-for"];
					const clientIp =
						(Array.isArray(forwarded)
							? forwarded[0] // already an array, take first
							: forwarded?.split(",")[0]) ?? // string, split on comma
						req.ip ??
						req.socket.remoteAddress ??
						"unknown";

					return `ip:${clientIp}`;
				},
				generateKey: (_context, trackerString, throttlerName) => {
					return `throttler:${throttlerName}:${trackerString}`;
				},
			}),
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: BlockedUserGuard,
		},
		{
			provide: AppModule,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(BlockedIpMiddleware)
			.forRoutes({ path: "*", method: RequestMethod.ALL });
		consumer
			.apply(GeoBlockMiddleware)
			.forRoutes({ path: "*", method: RequestMethod.ALL });

		consumer
			.apply(HoneypotMiddleware)
			.forRoutes(
				{ path: "/admin", method: RequestMethod.ALL },
				{ path: "/wp-admin", method: RequestMethod.ALL },
				{ path: "/wp-login.php", method: RequestMethod.ALL },
				{ path: "/.env", method: RequestMethod.ALL },
				{ path: "/config", method: RequestMethod.ALL },
				{ path: "/phpinfo.php", method: RequestMethod.ALL },
			);
	}
}
