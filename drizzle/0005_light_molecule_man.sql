CREATE TABLE `weather_climatology` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`point_id` text NOT NULL,
	`window_label` text NOT NULL,
	`years` text DEFAULT '' NOT NULL,
	`provider` text DEFAULT 'open-meteo' NOT NULL,
	`stats_json` text NOT NULL,
	`computed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weather_climatology_point_window` ON `weather_climatology` (`point_id`,`window_label`);--> statement-breakpoint
CREATE TABLE `weather_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`point_id` text NOT NULL,
	`provider` text DEFAULT 'open-meteo' NOT NULL,
	`forecast_json` text NOT NULL,
	`marine_json` text,
	`summary_json` text,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_weather_snapshots_point_fetched` ON `weather_snapshots` (`point_id`,`fetched_at`);