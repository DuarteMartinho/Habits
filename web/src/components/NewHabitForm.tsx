import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import { CheckboxForm } from "./CheckboxForm";


const availableWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

interface NewHabitFormProps {
    updateSummary: () => void;
}

export function NewHabitForm(props: NewHabitFormProps) {

    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    async function createNewHabit(event: FormEvent) {
        event.preventDefault();
    
        if (!title || weekDays.length === 0) {
            return;
        }

        await api.post('/create-habit', {
            title,
            weekDays
        })

        await props.updateSummary();

        setTitle('');
        setWeekDays([]);
        
        alert('Habit created successfully!');
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="mt-6 font-semibold leading-tight">
                What is the habit you want to track?
            </label>
            
            <input 
                type="text" 
                name="name" 
                id="name" 
                placeholder="e.g. Read 30 minutes a day, drink water, etc"
                autoFocus
                value={title}
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="mt-6 font-semibold leading-tight">
                What are the days you want to track this habit?
            </label>

            <div className='mt-3 flex flex-col gap-2'>
                {
                    availableWeekdays.map((day, index) => (
                        <CheckboxForm 
                            key={day}
                            title={day}
                            checked={weekDays.includes(index)}
                            onCheckedChange={isChecked => {
                                if (isChecked) {
                                    setWeekDays(prevState => [...prevState, index]);
                                } else {
                                    setWeekDays(prevState => prevState.filter(weekday => weekday !== index));
                                }
                            }}
                        />
                    ))
                }
            </div>

            

            <button 
                type="submit" 
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <Check size={20} weight="bold" />
                Confirm
            </button>

        </form>
    )
}