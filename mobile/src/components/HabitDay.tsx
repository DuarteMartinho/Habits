import { TouchableOpacity, TouchableOpacityProps,  Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { generateProgressPercentage } from "../utils/generateProgressPercentage";
import clsx from "clsx";
import dayjs from "dayjs";

const WEEKDAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_WIDTH = (Dimensions.get('screen').width / WEEKDAYS) - ( SCREEN_HORIZONTAL_PADDING + 5 );

interface Props extends TouchableOpacityProps {
    completed?: number;
    possible?: number;
    date: Date;
}

export function HabitDay({ completed = 0, possible = 0, date, ...rest }: Props) {

    const { navigate } = useNavigation();

    const percentage = possible > 0 ? generateProgressPercentage(completed, possible) : 0;

    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today, 'day');
    

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className= {
                clsx(
                    'rounded-lg border-2 m-1',
                    {
                        'bg-zinc-900 border-zinc-800': percentage === 0,
                        'bg-violet-900 border-violet-800': percentage > 0 && percentage < 20,
                        'bg-violet-800 border-violet-700': percentage >= 20 && percentage < 40,
                        'bg-violet-700 border-violet-600': percentage >= 40 && percentage < 60,
                        'bg-violet-600 border-violet-500': percentage >= 60 && percentage < 80,
                        'bg-violet-500 border-violet-400': percentage >= 80,
                        'border-white': isCurrentDay,
                    }
                )
            }
            style={{width: DAY_WIDTH, height: DAY_WIDTH}}
            {...rest}
        />
    )
}