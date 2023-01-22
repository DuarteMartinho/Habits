import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ProgressBar } from "../components/ProgressBar";
import { Loading } from "../components/Loading";
import { NoHabits } from "../components/NoHabits";
import { api } from "../lib/axios";
import { generateProgressPercentage } from '../utils/generateProgressPercentage'


const availableWeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        name: string;
        createdAt: string;
    }[];
}

export function Habit() {

    const [loading, setLoading] = useState<boolean>(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps>();
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const route = useRoute();
    const { date } = route.params as Params;

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(dayjs(), 'day');
    const weekday = parsedDate.day();
    const day_month = parsedDate.format('DD/MM');


    
    const habitsProgress = dayInfo?.possibleHabits.length 
        ? generateProgressPercentage( 
            completedHabits.length,
            dayInfo?.possibleHabits.length,
            )
        : 0;

    async function fetchHabits() {
        try {
            setLoading(true);


            const response = await api.get('/day', {
                params: {
                    date
                }
            });

            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'An error occurred while fetching your habits. Please, try again later.')
        } finally {
            setLoading(false);
        }
    }

    async function toggleCheckBoxPress(habitId: string ) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);
            if (completedHabits.includes(habitId) ) {
                setCompletedHabits(prevstate => prevstate.filter(id => id !== habitId));
            } else {
                setCompletedHabits(prevstate => [...prevstate, habitId]);
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'An error occurred while toggling your habit. Please, try again later.')
        }
    }

    useEffect(() => {
        fetchHabits();
    }, [])

    if (loading) {
        return (
            <Loading/> 
        )
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

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    { availableWeekDays[weekday] }
                </Text>

                <Text className=" text-white font-extrabold text-3xl">
                    { day_month }
                </Text>

                <ProgressBar progress={habitsProgress}/>

                <View className={clsx("mt-6", {
                    'opacity-30': isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits && dayInfo?.possibleHabits.length > 0 ?
                        dayInfo?.possibleHabits.map(habit => (
                            <Checkbox 
                                key={habit.id}
                                title={habit.name}
                                disabled={isDateInPast}
                                isChecked={completedHabits.includes(habit.id)}
                                onPress={() => toggleCheckBoxPress(habit.id)}
                            />
                        )) :
                        isDateInPast ? null : <NoHabits />

                    }
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            You can't edit your habits from past days
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    );
}