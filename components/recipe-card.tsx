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
        <View className="bg-surface rounded-xl p-4 mb-4 border border-border shadow-sm">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-lg font-bold text-foreground flex-1 pr-2">{name}</Text>
            <View className={cn("px-3 py-1 rounded-full", getDifficultyColor(difficulty))}>
              <Text className="text-xs font-semibold text-white capitalize">{difficulty}</Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-3 border-t border-border/30">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-muted">⏱️</Text>
              <Text className="text-sm font-medium text-muted">{prepTime} min</Text>
            </View>
            <Text className="text-xs text-primary font-semibold">Visualizza →</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
