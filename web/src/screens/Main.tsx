import dayjs from "dayjs"
import { useEffect, useState } from "react"
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'phosphor-react'



import logoImage from "../assets/logo.svg"
import { HabitDay } from "../components/HabitDay"
import { generateDates } from "../utils/generateDates"
import { api } from "../lib/axios"
import { NewHabitForm } from "../components/NewHabitForm";

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

type Summary = {
    "id": string;
    "date": string;
    "completed": number;
    "possible": number;
};

export function Main() {
    const [loading, setLoading] = useState<boolean>(true)
    const [summary, setSummary] = useState<Summary[]>([]);

    async function _updateSummary() {
        await api.get('/summary').then(res => {
                setSummary(res.data);
            }
        )
        return true;
    }

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        setLoading(true);
        await api.get('/summary').then(res => {
                setSummary(res.data);
            }
        );
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
    


    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        )
    }
    
    return (
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        
            <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
                <img src={logoImage} alt="habits" />

                < Dialog.Root>
                    <Dialog.Trigger 
                    type="button" 
                    className="border-2 border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300  transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-bg"
                    >
                    <Plus size={20} className="text-violet-500"/>
                    New Habit
                    </Dialog.Trigger>

                    <Dialog.Portal>
                    <Dialog.Overlay 
                        className="fixed inset-0 bg-black/80 w-screen h-screen"
                    />
                    <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Dialog.Close className="absolute top-6 right-6 rounded-lg hover:text-zinc-200 text-zinc-400 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
                        <X size={24} aria-label="Close" />
                        </Dialog.Close>

                        <Dialog.Title className="text-3xl leading-tight font-extrabold">
                        Create Habit
                        </Dialog.Title>

                        <NewHabitForm 
                            updateSummary={_updateSummary}
                        />
                    </Dialog.Content> 
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
            
            <div className="w-full flex">
                <div className="grid grid-rows-7 grid-flow-row gap-3">
                    {weekDays.map((day, i) => (
                        <div key={`${day} - ${i}`} className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold">
                            {day}
                        </div>
                    ))}
                </div>
                        
                <div className="grid grid-rows-7 grid-flow-col gap-3">
                    {
                    
                    summaryDates.length > 0 && summaryDates.map(
                        (date, i) => {
                            
                            const dayInSummary = summary.find(day => {
                                return dayjs(date).isSame(day.date, 'day')
                            })

                            return (
                                <HabitDay 
                                    defaultCompleted={dayInSummary?.completed || 0} 
                                    possible={dayInSummary?.possible || 0}
                                    date={date.toISOString()}
                                    key={`${date.toString()} - ${i}`} 
                                    updatefunc={_updateSummary}
                                />
                            )
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
        </div>
    )
}

