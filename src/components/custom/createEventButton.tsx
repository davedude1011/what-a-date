"use client"

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { addEvent } from "~/server/events";
import { toast } from "sonner";

export default function CreateEventButton({date, setRefreshEvents}: {date: Date|undefined, setRefreshEvents: (num: number) => void}) {
    const [eventType, setEventType] = useState("")
    const [eventName, setEventName] = useState("")
    const [isRecurring, setIsRecurring] = useState(false)

    return (
        <Sheet>
            <SheetTrigger>
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger>
                        <Button>Create event</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {date?.toDateString()}
                    </TooltipContent>
                    </Tooltip> 
                </TooltipProvider>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <div>
                    <Label htmlFor="eventDate">Event date</Label>
                    <Input id="eventDate" value={date?.toDateString()} disabled></Input>
                </div>
                <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select onValueChange={(value) => setEventType(value)} value={eventType}>
                        <SelectTrigger>
                            <SelectValue></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="birthday">Birthday</SelectItem>
                            <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="eventName">Event name</Label>
                    <Input id="eventName" onChange={(e) => setEventName(e.target.value)} value={eventName}></Input>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Checkbox id="eventRecurring" onCheckedChange={(checked: boolean) => setIsRecurring(checked)} checked={isRecurring} />
                    <Label htmlFor="eventRecurring">Recurring Event</Label>
                </div>
                <SheetClose asChild>
                    <Button onClick={() => {
                        addEvent({ eventType, eventName, date: (date ?? new Date()), isRecurring })
                            .then(() => {
                                toast("Event has been created", {
                                    description: `${eventType} - ${eventName} - ${date?.toDateString()}`,
                                })
                                setRefreshEvents(Math.random())
                            })
                            .catch((error) => console.log(error))
                    }}>Create Event</Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    )
}