"use client"

import { LucideCake } from "lucide-react";
import { useEffect, useState } from "react";
import CalendarButton from "~/components/custom/calendarButton";
import CreateEventButton from "~/components/custom/createEventButton";
import { ThemeToggle } from "~/components/custom/themeToggle";
import { Button } from "~/components/ui/button";
import { TextHoverEffect } from "~/components/ui/text-hover-effect";
import { Textarea } from "~/components/ui/textarea";
import { getEventsFromDate } from "~/server/events";
import { getGiftIdea } from "~/server/giftIdeas";

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return `th`; // Covers 11th to 19th
  switch (day % 10) {
    case 1: return `st`;
    case 2: return `nd`;
    case 3: return `rd`;
    default: return `th`;
  }
}

export default function Page() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [currentEvents, setCurrentEvents] = useState(null as null|{
      id: number;
      eventType: string | null;
      eventName: string | null;
      eventDay: number | null;
      eventMonth: number | null;
      eventYear: number | null;
      isRecurring: boolean | null;
      createdAt: Date;
      updatedAt: Date | null;
  }[])
  const [refreshEvents, setRefreshEvents] = useState(0)
  useEffect(() => {
    setCurrentEvents(null)
    getEventsFromDate(date ?? new Date())
      .then((response) => setCurrentEvents(response))
      .catch((error) => console.log(error))
  }, [date, refreshEvents])

  const [generationDescription, setGenerationDescription] = useState({} as Record<string, string>)
  const [aiResponse, setAiResponse] = useState({} as Record<string, string>)
  const [buttonDisabled, setButtonDisabled] = useState({} as Record<string, boolean>)

  function changeGenerationDescription(key: string, value: string) {
    setGenerationDescription({...generationDescription, [key]: value })
  }
  function changeAiResponse(key: string, value: string) {
    setAiResponse({...aiResponse, [key]: value })
  }
  function changeButtonDisabled(key: string, value: boolean) {
    setButtonDisabled({...buttonDisabled, [key]: value })
  }

  return (
    <div className="bg-background w-screen h-screen flex justify-center items-center">
      {
        currentEvents && currentEvents?.length > 0 && <TextHoverEffect text={currentEvents[0]?.eventType ?? ""} />
      }
      
      <div className="absolute top-0 left-0 m-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col gap-2 w-full h-full md:w-fit md:h-fit justify-center">
        <div className="absolute md:relative z-30 m-4 md:m-0 top-0 left-0">
          <CalendarButton {...{date, setDate}} />
        </div>
        <div className="flex flex-col border rounded-md p-12 z-20 bg-background gap-4">
          <div className="text-3xl md:text-6xl font-thin flex flex-row gap-4">
            <div>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date?.getDay() ?? 1]}</div>
            <div className="flex flex-row">
              <div>{date?.getDate()}</div>
              <div className="text-base">{getOrdinalSuffix(date?.getDate() ?? new Date().getDate())}</div>
            </div>
            <div>{["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date?.getMonth() ?? 0]}</div>
          </div>
          <div>
            {
              currentEvents && currentEvents?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {
                    currentEvents.map((event) => (
                      <div key={event.id} className="border rounded-md p-4 flex flex-col gap-4 md:gap-2">
                        <div className="flex flex-row gap-2 items-center">{{birthday: <LucideCake />}[event.eventType ?? "birthday"]}<span className="text-2xl font-thin">{event.eventName}</span> - <span>{event.eventType}</span></div>
                        <br />
                        <Textarea value={generationDescription[event.id.toString()]} onChange={(e) => {changeGenerationDescription(event.id.toString(), e.target.value)}} placeholder={{birthday: "Describe what they might like...", holiday: "Describe what your looking for..."}[event.eventType ?? "birthday"]}></Textarea>
                        <Button disabled={buttonDisabled[event.id.toString()]} variant={"default"} className="w-fit" onClick={() => {
                          changeButtonDisabled(event.id.toString(), true)
                          getGiftIdea(generationDescription[event.id.toString()] ?? "", event)
                            .then((response: string) => {
                              changeAiResponse(event.id.toString(), response)
                              changeButtonDisabled(event.id.toString(), false)
                            })
                            .catch((error) => console.log(error))
                        }}>Generate Gift Ideas</Button>
                        <Textarea value={aiResponse[event.id.toString()]} disabled></Textarea>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div>
                  <div>No Events for this date</div>
                  <CreateEventButton date={date} setRefreshEvents={setRefreshEvents} />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}