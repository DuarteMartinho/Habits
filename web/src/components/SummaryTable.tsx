


import { generateDates } from "../utils/generateDates"
import { HabitDay } from "./HabitDay"

const summaryDates = generateDates()
const weekDays = [
    'S', 
    'M', 
    'T', 
    'W', 
    'T', 
    'F', 
    'S',
]

const minimumSummaryDatesSize = 18 * 7 
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

export function SummaryTable() {
    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((day, i) => (
                    <div key={`${day} - ${i}`} className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold">
                        {day}
                    </div>
                ))}
            </div>
                    
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summaryDates.map(
                    (date, i) => {
                        return <HabitDay key={Date.toString()} />
                    }
                )}

                {amountOfDaysToFill > 0 && Array.from({
                    length: amountOfDaysToFill
                }).map(
                    (_, i) => {
                        return (
                            <div 
                                key={i} 
                                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                            ></div>
                        )
                    }
                )}
            </div>

        </div>
    )
}