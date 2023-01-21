import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Checkbox } from './Checkbox';
import { HabitsList } from './HabitsList';
import { ProgressBar } from './ProgressBar';


interface HabitProps {
    date: string;
    defaultCompleted: number; 
    possible: number; 
    updatefunc: () => void;
}

export function HabitDay({date, defaultCompleted, possible, updatefunc}: HabitProps) {

    const [ completed, setCompleted ] = useState<number>(defaultCompleted);

    const completedPercentage = possible > 0 ? Math.round(( completed / possible) * 100)  : 0;
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today, 'day');

    function handleCompletedChange(completed: number) {
        setCompleted(completed)
        updatefunc();
    }

    return (
        <Popover.Root>
            <Popover.Trigger 
            className={
                clsx(
                    'w-10 h-10 border-2 rounded-lg transition-colors  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-bg',
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
                        dayjs(date).format('dddd')
                    }</span>
                    <span className='mt-1 font-semibold leading-tight text-3xl'>{
                        dayjs(date).format('DD/MM')
                    }</span>

                    <ProgressBar progress={completedPercentage} />

                    <HabitsList 
                        date={date}
                        onCompletedChange={handleCompletedChange}
                    />

                    <Popover.Arrow height={8} width={16} className='fill-zinc-900 ' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
        
    )
}