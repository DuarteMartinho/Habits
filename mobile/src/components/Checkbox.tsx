import { TouchableOpacity, TouchableOpacityProps, View, Text } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

interface Props extends TouchableOpacityProps {
    title: string;
    isChecked?: boolean;
}

export function Checkbox({title, isChecked=false, ...rest}: Props) {
    return (
        <TouchableOpacity 
            className="flex-row mb-2 items-center"
            activeOpacity={0.7}
            {...rest}
        >
            {
                isChecked
                ?
                <View className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center">
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                </View>
                :
                <View className="h-8 w-8 bg-zinc-900 rounded-lg items-center justify-center">
                    
                </View>
            }
            

            <Text className="text-white ml-3 text-base font-semibold">
                { title }
            </Text>
        </TouchableOpacity>
    );
}