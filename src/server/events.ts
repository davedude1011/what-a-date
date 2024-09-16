"use server"

import { and, eq, or } from "drizzle-orm"
import { db } from "./db"
import { events } from "./db/schema"

export async function addEvent(eventData: {eventType: string, eventName: string, date: Date, isRecurring: boolean}) {
    await db.insert(events).values({
        eventType: eventData.eventType,
        eventName: eventData.eventName,
        eventDay: eventData.date.getDate(),
        eventMonth: eventData.date.getMonth(),
        eventYear: eventData.date.getFullYear(),
        isRecurring: eventData.isRecurring
    })
    return 1
}

export async function getEventsFromDate(date: Date) {
    return await db.select().from(events).where(
        or(
            and(
                eq(events.isRecurring, true),
                and(
                    eq(events.eventDay, date.getDate()),
                    eq(events.eventMonth, date.getMonth()),
                )
            ),
            and(
                eq(events.eventDay, date.getDate()),
                eq(events.eventMonth, date.getMonth()),
                eq(events.eventYear, date.getFullYear())
            )
        )
    ) ?? null
}