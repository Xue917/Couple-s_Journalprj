import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  currentRole: 'male' | 'female';
  onClose: () => void;
  onSwitchRole: (role: 'male' | 'female') => void;
}

export const SettingsModal: React.FC<Props> = ({ currentRole, onClose, onSwitchRole }) => {
  const [maleName, setMaleName] = useState(localStorage.getItem('maleName') || '我 (男生)');
  const [femaleName, setFemaleName] = useState(localStorage.getItem('femaleName') || '女友 (女友)');

  const handleSave = () => {
    localStorage.setItem('maleName', maleName);
    localStorage.setItem('femaleName', femaleName);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>⚙️ 系統與足跡設定</Text>

        <View style={styles.section}>
          <Text style={styles.label}>👤 當前登入身分：</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleOption, currentRole === 'male' && styles.activeMale]}
              onPress={() => onSwitchRole('male')}
            >
              <Text style={[styles.roleOptionText, currentRole === 'male' && styles.whiteText]}>
                👦 男生
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, currentRole === 'female' && styles.activeFemale]}
              onPress={() => onSwitchRole('female')}
            >
              <Text style={[styles.roleOptionText, currentRole === 'female' && styles.whiteText]}>
                👧 女生
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>🏷️ 暱稱管理：</Text>
          <Text style={styles.subLabel}>男生暱稱：</Text>
          <TextInput
            style={styles.input}
            value={maleName}
            onChangeText={setMaleName}
            placeholder="請輸入男生暱稱"
          />

          <Text style={styles.subLabel}>女生暱稱：</Text>
          <TextInput
            style={styles.input}
            value={femaleName}
            onChangeText={setFemaleName}
            placeholder="請輸入女生暱稱"
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>關閉</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>儲存設定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed' as any,
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(30, 25, 22, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    width: 360,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#5C4D44', marginBottom: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#8C7A6B', marginBottom: 8 },
  subLabel: { fontSize: 12, color: '#6B5B52', marginTop: 6, marginBottom: 4 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleOption: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FAF4ED', alignItems: 'center' },
  activeMale: { backgroundColor: '#4A90E2' },
  activeFemale: { backgroundColor: '#E07A5F' },
  roleOptionText: { fontSize: 13, fontWeight: '700', color: '#6B5B52' },
  whiteText: { color: '#FFF' },
  input: { backgroundColor: '#FAF4ED', borderRadius: 12, padding: 10, fontSize: 13, borderWidth: 1, borderColor: '#EFE3D8', color: '#4A3E3D' },
  btnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#FAF4ED' },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#E07A5F' },
  cancelText: { color: '#8C7A6B', fontSize: 13, fontWeight: '600' },
  saveText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});