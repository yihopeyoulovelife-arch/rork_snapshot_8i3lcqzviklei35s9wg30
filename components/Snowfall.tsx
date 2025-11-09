import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

interface SnowflakeProps {
  delay: number;
}

const Snowflake: React.FC<SnowflakeProps> = ({ delay }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    const startX = Math.random() * width;
    const drift = (Math.random() - 0.5) * 100;
    
    translateX.setValue(startX);

    const animate = () => {
      translateY.setValue(-20);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.5 + 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: height + 20,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX + drift,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [translateY, translateX, opacity, delay, height, width]);

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          opacity,
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
};

interface SnowfallProps {
  count?: number;
  color?: string;
}

export const Snowfall: React.FC<SnowfallProps> = ({ count = 50, color = "#ffffff" }) => {
  const snowflakes = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {snowflakes.map((_, index) => (
        <View key={index} style={[styles.snowflake, { backgroundColor: color }]}>
          <Snowflake delay={Math.random() * 5000} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  snowflake: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ffffff",
  },
});
