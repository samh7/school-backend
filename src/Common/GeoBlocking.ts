import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as geoip from "geoip-lite";

@Injectable()
export class GeoBlockMiddleware implements NestMiddleware {
	private readonly logger = new Logger("GeoBlock");
	private readonly aLLOWED = new Set(["TZ"]);

	use(req: Request, res: Response, next: NextFunction): void {
		if (process.env.NODE_ENV === "development") {
			next();
			return;
		}

		const ip =
			(req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
			req.ip ??
			"unknown";

		const geo = geoip.lookup(ip);

		console.log("IP", ip);
		console.log("geo", geo);

		if (!geo || !this.aLLOWED.has(geo.country)) {
			this.logger.warn({
				type: "GeoBlocked",
				ip,
				country: geo?.country ?? "unknown",
				path: req.url,
			});
			res.status(403).json({
				success: false,
				statusCode: 403,
				message: "Access not available in your region",
			});
			return;
		}

		next();
	}
}
