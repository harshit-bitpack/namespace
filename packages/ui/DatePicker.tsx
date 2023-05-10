"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "./lib/utils";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

function isValidDate(d: Date) {
  return !isNaN(d?.getTime());
}

export function DatePicker({
  onDateChange,
  defaultDate,
}: {
  onDateChange: (date: Date) => void;
  defaultDate?: string | Date;
}) {
  const [date, setDate] = React.useState<Date>(
    new Date(Date.parse(defaultDate as string)) || new Date()
  );
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate as Date);
    onDateChange(newDate as Date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isValidDate(date) ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => handleDateChange(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
