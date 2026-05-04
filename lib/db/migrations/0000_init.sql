CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`label` text,
	`state` text DEFAULT 'created' NOT NULL,
	`email` text,
	`email_sent` integer DEFAULT false NOT NULL,
	`answers` text,
	`scores` text,
	`archetype` text,
	`result_image` text,
	`created_at` integer NOT NULL,
	`completed_at` integer
);
--> statement-breakpoint
CREATE INDEX `tokens_order_id_idx` ON `tokens` (`order_id`);--> statement-breakpoint
CREATE INDEX `tokens_state_idx` ON `tokens` (`state`);--> statement-breakpoint
CREATE INDEX `tokens_created_at_idx` ON `tokens` (`created_at`);