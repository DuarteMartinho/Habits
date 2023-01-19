import { ScrollView, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import dayjs from "dayjs";


interface Params {
    date: string;
}


import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { ProgressBar } from "../components/ProgressBar";


const availableWeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

export function Habit() {

    const route = useRoute();
    const { date } = route.params as Params;

    const parsedDate = dayjs(date);
    const weekday = parsedDate.day();
    const day_month = parsedDate.format('DD/MM');

    console.log(date);
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

                <ProgressBar progress={33}/>

                <View className="mt-6">
                    <Checkbox 
                        key={1}
                        title={"Exercise"}
                        isChecked={false}
                        onPress={() => {}}
                    />
                    <Checkbox 
                        key={2}
                        title={"Exercise 2 "}
                        isChecked={true}
                        onPress={() => {}}
                    />
                    <Checkbox 
                        key={3}
                        title={"Exercise 3" }
                        isChecked={false}
                        onPress={() => {}}
                    />
                </View>

            </ScrollView>
        </View>
    );
}