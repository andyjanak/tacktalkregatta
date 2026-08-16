CREATE TABLE `admin_password_overrides` (
	`email` text PRIMARY KEY NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	`iterations` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
