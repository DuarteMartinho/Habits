import * as Cb from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';

interface Props extends Cb.CheckboxProps  {
    title: string;
}

export function Checkbox({title, ...rest}: Props) {
    return (
            <Cb.Root 
                className='flex items-center gap-3 group  group-focus:outline-none disabled:cursor-not-allowed'
                {...rest}
            >
                <div 
                    className='h-8 w-8 rounded-lg flex items-center justify-center border-2 bg-zinc-900 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-bg'
                >
                    <Cb.Indicator> 
                        <Check size={20} className='text-white' />
                    </Cb.Indicator>
                </div>
                <span className='text-white text-xl font-semibold leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 transition-colors'>
                    { title }
                </span>
            </Cb.Root>
    )
}