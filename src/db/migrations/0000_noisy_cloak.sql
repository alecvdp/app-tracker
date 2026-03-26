CREATE TABLE `apps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`pricing_type` text DEFAULT 'free' NOT NULL,
	`subscription_plan` text,
	`next_due_date` text,
	`platforms` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'using' NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
