import { format, getDate, getMonth } from "date-fns"
import { Calendar } from "~/components/ui/calendar"
import { CalendarDays, LucideCake } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { BackgroundGradient } from "~/components/ui/background-gradient"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "~/components/ui/drawer"
import { HoverBorderGradient } from "../ui/hover-border-gradient"

const specialDates = [
  {
    date: new Date("2008-09-22"),
    occasion: "birthday",
    recipient: "Thomas",
    icon: <LucideCake size={20} />
  }
]

export default function CalendarButton({date, setDate}: {date: Date|undefined, setDate: (date: Date|undefined) => void}) {
    function getDateData(day: Date) {
      function isSameDayAndMonth(date1: Date, date2: Date): boolean {
        return getDate(date1) === getDate(date2) && getMonth(date1) === getMonth(date2)
      }
      for (const specialDateData of specialDates) {
        if (isSameDayAndMonth(specialDateData.date, day)) {
          return specialDateData
        }
      }
      return null
    }

    return (
      <Drawer>
        <DrawerTrigger>
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <CalendarDays size={18} />
            <span>Select Date</span>
          </HoverBorderGradient>
        </DrawerTrigger>
        <DrawerContent>
          <div className="flex items-center justify-center p-12">
            <BackgroundGradient className="rounded-[22px] bg-background p-12">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                components={{
                  DayContent: ({ date: dayDate, ...props }) => (
                    <DrawerClose className="w-full h-full">
                      {
                        getDateData(dayDate) ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div {...props} className="">
                                  {
                                    getDateData(dayDate)?.icon
                                  }
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {
                                  getDateData(dayDate)?.occasion == "birthday" ? (
                                    <div>
                                      {getDateData(dayDate)?.recipient}{"'"}{getDateData(dayDate)?.recipient[(getDateData(dayDate)?.recipient.length ?? 1)-1] != "s" ? "s" : ""} Birthday
                                    </div>
                                  ) : (
                                    <div></div>
                                  )
                                }
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div {...props}>
                            {format(dayDate, "d")}
                          </div>
                        )
                      }
                    </DrawerClose>
                  )
                }}
              />
            </BackgroundGradient>
          </div>
        </DrawerContent>
      </Drawer>
    )
}