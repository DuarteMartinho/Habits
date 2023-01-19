import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";

import { HabitDay, DAY_WIDTH } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateDates } from "../utils/generateDates";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const dates = generateDates();
const minimumDates = 15 * 7;
const amountOfDates = minimumDates - dates.length;

export function Home() {

    const { navigate } = useNavigation();

    return (
        <View className="bg-background flex-1 px-8 pt-16">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((day, index) => (
                        <Text
                            key={`${day} - ${index}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_WIDTH }}
                        >
                            {day}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                <View className="flex-row flex-wrap">
                    {
                        dates.map((date, index) => (
                            <HabitDay 
                                key={date.toISOString()}   
                                onPress={() => navigate('habit', { date: date.toISOString()})}
                            />
                        ))
                    }

                    {
                        amountOfDates > 0 && Array
                        .from({length: amountOfDates})
                        .map((_, index) => (
                                <View 
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{width: DAY_WIDTH, height: DAY_WIDTH}}
                                />
                            ))
                        
                    }
                </View>
            </ScrollView>
           
        </View>
    );
}