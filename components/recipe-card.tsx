import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  id: number;
  name: string;
  prepTime: number;
  difficulty: "facile" | "media" | "difficile";
  onPress: (id: number) => void;
}

export function RecipeCard({ id, name, prepTime, difficulty, onPress }: RecipeCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.9);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-success";
      case "media":
        return "bg-warning";
      case "difficile":
        return "bg-error";
      case "complesso":
        return "bg-error";
      default:
        return "bg-muted";
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <Pressable
      onPress={() => onPress(id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        <View
          className="mb-4 rounded-[28px] border border-border bg-surface p-5"
          style={{
            shadowColor: "#020617",
            shadowOpacity: 0.08,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 3,
          }}
        >
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-[1.4px] text-muted">Ricetta</Text>
              <Text className="mt-2 text-xl font-bold leading-7 text-foreground">{name}</Text>
            </View>
            <View className={cn("rounded-full px-3 py-1.5", getDifficultyColor(difficulty))}>
              <Text className="text-xs font-semibold text-white capitalize">{difficulty}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between rounded-2xl bg-background px-4 py-3">
            <View>
              <Text className="text-xs uppercase tracking-[1.2px] text-muted">Tempo medio</Text>
              <Text className="mt-1 text-base font-semibold text-foreground">{prepTime} min</Text>
            </View>
            <Text className="text-sm font-semibold text-primary">Apri dettagli</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
