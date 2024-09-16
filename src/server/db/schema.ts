import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `what-a-date_${name}`);

export const events = createTable(
  "events",
  {
    id: serial("id").primaryKey(),
    eventType: varchar("event_type", { length: 256 }),
    eventName: varchar("event_name", { length: 256 }),
    eventDay: integer("event_day"),
    eventMonth: integer("event_month"),
    eventYear: integer("event_year"),
    isRecurring: boolean("is_recurring"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);
