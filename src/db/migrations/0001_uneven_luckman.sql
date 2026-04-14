ALTER TABLE `apps` ADD `monthly_cost` real;--> statement-breakpoint
ALTER TABLE `apps` ADD `yearly_cost` real;--> statement-breakpoint
ALTER TABLE `apps` ADD `category` text;--> statement-breakpoint
ALTER TABLE `apps` ADD `tags` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `apps` ADD `release_date` text;