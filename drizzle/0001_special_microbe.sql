CREATE TABLE `email_campaign_recipients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`campaign_id` integer NOT NULL,
	`inquiry_id` integer NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`company` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`provider_message_id` text,
	`error_message` text,
	`sent_at` text,
	`delivered_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_email_recipients_campaign_email` ON `email_campaign_recipients` (`campaign_id`,`email`);--> statement-breakpoint
CREATE INDEX `idx_email_recipients_provider_message` ON `email_campaign_recipients` (`provider_message_id`);--> statement-breakpoint
CREATE INDEX `idx_email_recipients_campaign_status` ON `email_campaign_recipients` (`campaign_id`,`status`);--> statement-breakpoint
CREATE TABLE `email_campaigns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subject` text NOT NULL,
	`preview_text` text DEFAULT '' NOT NULL,
	`body` text NOT NULL,
	`audience` text DEFAULT 'all_active' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`recipient_count` integer DEFAULT 0 NOT NULL,
	`sent_count` integer DEFAULT 0 NOT NULL,
	`failed_count` integer DEFAULT 0 NOT NULL,
	`created_by_email` text NOT NULL,
	`sent_by_email` text,
	`sent_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_email_campaigns_status_created_at` ON `email_campaigns` (`status`,`created_at`);--> statement-breakpoint
ALTER TABLE `inquiries` ADD `boat_interest` text DEFAULT 'undecided' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `tags` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `next_follow_up_at` text;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `email_permission` text DEFAULT 'allowed' NOT NULL;--> statement-breakpoint
ALTER TABLE `inquiries` ADD `email_opt_out_at` text;--> statement-breakpoint
CREATE INDEX `idx_inquiries_follow_up` ON `inquiries` (`next_follow_up_at`);--> statement-breakpoint
PRAGMA optimize;
