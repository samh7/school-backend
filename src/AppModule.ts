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
import { Request } from "express";
import Redis from "ioredis";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";
import { AuthModule } from "./Auth/AuthModule";
import { BlockedIpMiddleware } from "./Common/BlockedIpMiddleware";
import { BlockedUserGuard } from "./Common/BlockedUsers";
import { CamelNamingStrategy } from "./Common/camelNamingStrategy";
import { GeoBlockMiddleware } from "./Common/GeoBlocking";
import { HoneypotMiddleware } from "./Common/HoneyPot";
import { EnvironmentVariables } from "./Config/EnvTypes";
import { SchoolModule } from "./Controllers/1.SchoolModule";
import { StudentEnrollmentModule } from "./Controllers/10.StudentEnrollmentModule";
import { StaffModule } from "./Controllers/11.StaffModule";
import { ClassTeacherModule } from "./Controllers/12.ClassTeacherModule";
import { SubjectTeacherModule } from "./Controllers/13.SubjectTeacherModule";
import { StudentSubjectAssignmentModule } from "./Controllers/14.StudentSubjectAssignmentModule";
import { AcademicYearModule } from "./Controllers/2.AcademicYearModule";
import { TermModule } from "./Controllers/3.TermModule";
import { GradeLevelModule } from "./Controllers/4.GradeLevelModule";
import { StreamModule } from "./Controllers/5.StreamModule";
import { SubjectModule } from "./Controllers/6.SubjectModule";
import { GradeSubjectModule } from "./Controllers/7.GradeSubjectModule";
import { UserAccountModule } from "./Controllers/8.UserAccountModule";
import { StudentModule } from "./Controllers/9.StudentModule";

interface AuthenticatedRequest extends Request {
	user?: {
		Id: string;
	};
}
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
				type: "better-sqlite3",
				database: config.getOrThrow("DATABASE_URL"),
				entities: [__dirname + "/**/*Entity.{ts,js}"],
				synchronize: config.getOrThrow("NODE_ENV") !== "production",
				namingStrategy: new CamelNamingStrategy(),
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
				errorMessage: "Wow! Slow Down.",
				storage: new ThrottlerStorageRedisService(redis),
				getTracker: (req: AuthenticatedRequest) => {
					if (req.user?.Id) return `user:${req.user.Id}`;

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
		// RedisHealthService,
		{
			provide: APP_GUARD,
			useClass: BlockedUserGuard,
		},
		{
			provide: AppModule,
			useClass: ThrottlerGuard,
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
