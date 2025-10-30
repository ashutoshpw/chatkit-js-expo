import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../../context';

export function Select({ options = [], value: initialValue, onChange, placeholder = 'Select...', ...props }: any) {
  const { theme } = useTheme();
  const [value, setValue] = useState(initialValue || '');
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt: any) => opt.value === value);

  const handleSelect = (optionValue: any) => {
    setValue(optionValue);
    onChange?.(optionValue);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.select, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.text, { color: selectedOption ? theme.colors.text : theme.colors.textSecondary }]}>
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                  <Text style={[styles.optionText, { color: theme.colors.text }]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    padding: 16,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
});
