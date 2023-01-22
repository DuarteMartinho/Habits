import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";

export function NoHabits() {
    const { navigate } = useNavigation();

    return (
        <Text className="text-zinc-400 text-base">
            You don't have any habits yet {' '}
            <Text
                className="text-violet-400 text-base underline active:text-violet-600"
                onPress={() => navigate('new')}
            >
                register one
            </Text>
            
        </Text>
    )
}