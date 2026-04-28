import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View, type TextInputProps, type ViewProps } from "react-native";

import { cn } from "@/lib/utils";

const contentWidthStyle = {
  width: "100%" as const,
  maxWidth: 880,
  alignSelf: "center" as const,
};

export function ResponsiveContainer({ className, style, ...props }: ViewProps & { className?: string }) {
  return <View className={cn("w-full", className)} style={[contentWidthStyle, style]} {...props} />;
}

export function Surface({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn("rounded-[28px] border border-border bg-surface", className)}
      style={{
        shadowColor: "#020617",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
      }}
      {...props}
    />
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <View className="flex-1">
        {eyebrow ? <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-primary">{eyebrow}</Text> : null}
        <Text className="mt-2 text-[32px] font-bold leading-9 text-foreground">{title}</Text>
        {description ? <Text className="mt-2 text-sm leading-6 text-muted">{description}</Text> : null}
      </View>
      {action ? <View className="pt-1">{action}</View> : null}
    </View>
  );
}

export function SectionTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <View className="flex-row items-end justify-between gap-3">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {description ? <Text className="mt-1 text-sm text-muted">{description}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  className,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn("h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface", className)}
      style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
    >
      <MaterialIcons name={icon} size={22} color="#3b82f6" />
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
  className,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentProps<typeof MaterialIcons>["name"];
  className?: string;
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn("min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-5", isDisabled && "opacity-50", className)}
      style={({ pressed }) => ({ transform: [{ scale: pressed && !isDisabled ? 0.99 : 1 }] })}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <>
          {icon ? <MaterialIcons name={icon} size={18} color="#ffffff" /> : null}
          <Text className="text-base font-semibold text-white">{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  className,
}: {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof MaterialIcons>["name"];
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn("min-h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4", className)}
      style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
    >
      {icon ? <MaterialIcons name={icon} size={18} color="#3b82f6" /> : null}
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
    </Pressable>
  );
}

export function TextField({
  label,
  hint,
  containerClassName,
  className,
  ...props
}: TextInputProps & { label: string; hint?: string; className?: string; containerClassName?: string }) {
  return (
    <View className={cn("gap-2", containerClassName)}>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        className={cn("min-h-14 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground", className)}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {hint ? <Text className="text-xs text-muted">{hint}</Text> : null}
    </View>
  );
}

export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn("rounded-full border px-4 py-2.5", selected ? "border-primary bg-primary" : "border-border bg-surface")}
      style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
    >
      <Text className={cn("text-sm font-semibold", selected ? "text-white" : "text-foreground")}>{label}</Text>
    </Pressable>
  );
}

export function InfoBanner({
  tone = "default",
  title,
  description,
}: {
  tone?: "default" | "error" | "warning";
  title: string;
  description?: string;
}) {
  const toneClass =
    tone === "error"
      ? "border-error/30 bg-error/10"
      : tone === "warning"
        ? "border-warning/30 bg-warning/10"
        : "border-border bg-surface";

  return (
    <View className={cn("rounded-2xl border p-4", toneClass)}>
      <Text className="text-sm font-semibold text-foreground">{title}</Text>
      {description ? <Text className="mt-1 text-sm leading-6 text-muted">{description}</Text> : null}
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  description: string;
}) {
  return (
    <Surface className="items-center px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <MaterialIcons name={icon} size={28} color="#3b82f6" />
      </View>
      <Text className="mt-4 text-lg font-semibold text-foreground">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-6 text-muted">{description}</Text>
    </Surface>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 py-10">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-sm text-muted">{label}</Text>
    </View>
  );
}

export function MetricTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View className={cn("min-w-[140px] flex-1 rounded-2xl border p-4", accent ? "border-primary/20 bg-primary/10" : "border-border bg-background")}>
      <Text className="text-xs uppercase tracking-[1.2px] text-muted">{label}</Text>
      <Text className={cn("mt-2 text-2xl font-bold", accent ? "text-primary" : "text-foreground")}>{value}</Text>
    </View>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return <SecondaryButton label="Indietro" icon="arrow-back" onPress={onPress} className="self-start" />;
}
