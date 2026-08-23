import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  currentRole: 'male' | 'female';
  onSwitchRole: (role: 'male' | 'female') => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<Props> = ({ currentRole, onSwitchRole, onOpenSettings }) => {
  const [maleName, setMaleName] = useState('我 (男生)');
  const [femaleName, setFemaleName] = useState('女友 (女友)');

  useEffect(() => {
    const savedMale = localStorage.getItem('maleName');
    const savedFemale = localStorage.getItem('femaleName');
    if (savedMale) setMaleName(savedMale);
    if (savedFemale) setFemaleName(savedFemale);
  }, []);

  const handleMaleNameChange = (text: string) => {
    setMaleName(text);
    localStorage.setItem('maleName', text);
  };

  const handleFemaleNameChange = (text: string) => {
    setFemaleName(text);
    localStorage.setItem('femaleName', text);
  };

  return (
    <View style={styles.container}>
      {/* 左側：設定按鈕 */}
      <TouchableOpacity style={styles.settingsBtn} onPress={onOpenSettings}>
        <Text style={styles.settingsText}>⚙️ 設定</Text>
      </TouchableOpacity>

      {/* 右側：維持當前登入身份與暱稱編輯 */}
      <View style={styles.roleGroup}>
        {/* 男生標籤 */}
        <View style={[styles.roleChip, currentRole === 'male' ? styles.activeMale : styles.inactiveChip]}>
          <Text style={styles.emojiText}>👦</Text>
          {currentRole === 'female' ? (
            <TextInput
              style={styles.nameInput}
              value={maleName}
              onChangeText={handleMaleNameChange}
              placeholder="修改男生暱稱"
              placeholderTextColor="#8C7A6B"
            />
          ) : (
            <TouchableOpacity onPress={() => onSwitchRole('male')}>
              <Text style={[styles.roleText, currentRole === 'male' && styles.activeText]}>
                {maleName}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 女生標籤 */}
        <View style={[styles.roleChip, currentRole === 'female' ? styles.activeFemale : styles.inactiveChip]}>
          <Text style={styles.emojiText}>👧</Text>
          {currentRole === 'male' ? (
            <TextInput
              style={styles.nameInput}
              value={femaleName}
              onChangeText={handleFemaleNameChange}
              placeholder="修改女生暱稱"
              placeholderTextColor="#8C7A6B"
            />
          ) : (
            <TouchableOpacity onPress={() => onSwitchRole('female')}>
              <Text style={[styles.roleText, currentRole === 'female' && styles.activeText]}>
                {femaleName}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  settingsBtn: {
    backgroundColor: '#FAF4ED',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFE3D8',
  },
  settingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C4D44',
  },
  roleGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  activeMale: {
    backgroundColor: '#4A90E2',
  },
  activeFemale: {
    backgroundColor: '#E07A5F',
  },
  inactiveChip: {
    backgroundColor: '#FAF4ED',
  },
  emojiText: {
    fontSize: 13,
    marginRight: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B5B52',
  },
  activeText: {
    color: '#FFF',
  },
  nameInput: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A3E3D',
    padding: 0,
    minWidth: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#B5A89E',
  },
});