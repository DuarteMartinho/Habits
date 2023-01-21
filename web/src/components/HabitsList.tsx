import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Checkbox } from "./Checkbox";

interface HabitListProps {
    date: string;
    onCompletedChange: (completed: number) => void;
}


interface HabitInfo {
    possibleHabits: { 
        id: string;
        name: string;
        createdAt: string;
    }[], 
    completedHabits: string []
}

export function HabitsList({date, onCompletedChange } : HabitListProps) {

    const [habitsInfo, setHabitInfo] = useState<HabitInfo>();

    useEffect(() => {
        api.get('/day', { 
            params: {
                date: date
            }
        }).then(res => {
            setHabitInfo(res.data);
        })
    }, [])

    const isDatePast = dayjs(date).endOf('day').isBefore(new Date());

    async function handleToggleID( habitId: string ) {
        const isHabitAlreadyTaken = habitsInfo?.completedHabits.includes(habitId);

        await api.patch(`/habits/${habitId}/toggle`)

        let completedHabits: string[] = [];

        if (isHabitAlreadyTaken) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);

            setHabitInfo( { 
                possibleHabits: habitsInfo!.possibleHabits, 
                completedHabits,   
            } )   
            
            onCompletedChange(completedHabits.length);
        } else {
            completedHabits = [...habitsInfo!.completedHabits, habitId];

            setHabitInfo( {
                possibleHabits: habitsInfo!.possibleHabits,
                completedHabits,
            } )

            onCompletedChange(completedHabits.length);

        }
    }

    return (
        <div className='mt-6 flex flex-col gap-3'>
            {
                habitsInfo?.possibleHabits.map((habit, index) => {
                        return ( 
                            <Checkbox
                                key={habit.id}
                                title={habit.name}
                                disabled={isDatePast}
                                defaultChecked={ habitsInfo?.completedHabits.includes(habit.id) }
                                onCheckedChange={isChecked => { handleToggleID( habit.id ) }}
                            /> 
                        )
                    }
                )
            }
        </div>
    )
}

