import { TouchableOpacity, TouchableOpacityProps,  Dimensions } from "react-native";

const WEEKDAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_WIDTH = (Dimensions.get('screen').width / WEEKDAYS) - ( SCREEN_HORIZONTAL_PADDING + 5 );

import { useNavigation } from '@react-navigation/native';

interface Props extends TouchableOpacityProps {}

export function HabitDay({ ...rest }: Props) {

    const { navigate } = useNavigation();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
            style={{width: DAY_WIDTH, height: DAY_WIDTH}}
            {...rest}
        />
    )
}