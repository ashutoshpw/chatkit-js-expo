import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context';

export interface StartScreenProps {
  greeting?: string;
  prompts?: Array<{ label: string; prompt: string }>;
  onPromptPress?: (prompt: string) => void;
}

/**
 * StartScreen component - shown when there are no messages
 */
export function StartScreen({
  greeting = 'Welcome to ChatKit',
  prompts = [],
  onPromptPress
}: StartScreenProps) {
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>{greeting}</Text>

        {prompts.length > 0 && (
          <View style={styles.promptsContainer}>
            {prompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.promptButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => onPromptPress?.(prompt.prompt)}
              >
                <Text style={[styles.promptLabel, { color: theme.colors.text }]}>{prompt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  promptsContainer: {
    gap: 12,
    width: '100%',
  },
  promptButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  promptLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
});
