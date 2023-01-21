import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Checkbox } from './Checkbox';
import { ProgressBar } from './ProgressBar';


interface HabitProps {
    date: string;
    completed: number; 
    possible: number; 
}
interface HabitProps {
    date: string;
    completed: number; 
    possible: number; 
}

interface Habit {
    id: string;
    name: string;
    createdAt: string;
}


export function HabitDay(props: HabitProps) {

    
    const [allhabits, setHabits] = useState<Habit[]>([]);
    const [completed, setComplete] = useState<number[]>([]);

    useEffect(() => {
        api.get('/day?date=' + props.date).then(res => {
            const habits = res.data.possibleHabits;
            setHabits(habits);
        })
    }, [])
    
    


    const completedPercentage = props.possible > 0 ? Math.round((props.completed / props.possible) * 100)  : 0;
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(props.date).isSame(today, 'day');

    return (
        <Popover.Root>
            <Popover.Trigger 
            className={
                clsx(
                    'w-10 h-10 border-2 rounded-lg',
                    {
                        'bg-zinc-900 border-zinc-800': completedPercentage === 0,
                        'bg-violet-900 border-violet-800': completedPercentage > 0 && completedPercentage < 20,
                        'bg-violet-800 border-violet-700': completedPercentage >= 20 && completedPercentage < 40,
                        'bg-violet-700 border-violet-600': completedPercentage >= 40 && completedPercentage < 60,
                        'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                        'bg-violet-500 border-violet-400': completedPercentage >= 80,
                        'border-white': isCurrentDay,
                    }
                )
            } />


            <Popover.Portal>
                <Popover.Content className='min-w-[320px] w-full p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>{
                        dayjs(props.date).format('dddd')
                    }</span>
                    <span className='mt-1 font-semibold leading-tight text-3xl'>{
                        dayjs(props.date).format('DD/MM')
                    }</span>

                    <ProgressBar progress={completedPercentage} />

                    <div className='mt-6 flex flex-col gap-3'>

                        {
                            allhabits.map((habit, index) => {
                                    return ( 
                                        <Checkbox
                                            key={habit.id}
                                            title={habit.name}
                                            checked={completed.includes(index)}
                                            onCheckedChange={isChecked => {
                                                if (isChecked) {
                                                    setComplete(prevState => [...prevState, index]);
                                                } else {
                                                    setComplete(prevState => prevState.filter(weekday => weekday !== index));
                                                }
                                            }}
                                        /> 
                                   )
                                }
                                
                            )

                        }
                        
                    </div>

                    <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        
    )
}