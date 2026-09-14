CREATE TABLE `partner_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`contact_name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`interest_level` text DEFAULT '' NOT NULL,
	`budget_band` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`consent_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_partner_inquiries_status_created_at` ON `partner_inquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_partner_inquiries_email` ON `partner_inquiries` (`email`);