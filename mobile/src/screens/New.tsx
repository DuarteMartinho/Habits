import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";


import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";



const availableWeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

export function New() {

    const [weekDays, setWeekdays] = useState<number[]>([]);

    function handleToggleWeekday(weekdayIndex: number) {
        if (weekDays.includes(weekdayIndex)) {
            setWeekdays(prevstate =>  prevstate.filter(day => day !== weekdayIndex));
        } else {
            setWeekdays(prevstate => [...prevstate, weekdayIndex]);
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100
                }}
            >
                <BackButton/>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Create Habit
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    What is your habit?
                </Text>

                <TextInput
                    className="mt-4 bg-zinc-900 rounded-lg border-2 border-zinc-800 text-white font-semibold text-base px-4 py-2 focus:border-green-600"
                    placeholder="Ex: Read 1 chapter of a book"
                    placeholderTextColor={colors.zinc[600]}
                />

                <Text className="mt-4 mb-3 text-white font-semibold text-base">
                    What days do you want to do it?
                </Text>

                {
                    availableWeekDays.map((day, index) => {
                        return (
                            <Checkbox 
                                key={day}
                                title={day}
                                isChecked={weekDays.includes(index)}
                                onPress={() => handleToggleWeekday(index)}
                            />
                        )
                    })                    
                }

                
                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-lg mt-6"
                    activeOpacity={0.7}
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text
                        className="font-semibold text-white text-base ml-2"
                    >
                        Save
                    </Text>

                </TouchableOpacity>
                
                

            </ScrollView>
        </View>
    );
}