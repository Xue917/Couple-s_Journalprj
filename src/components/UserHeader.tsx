import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserType } from '../types';

interface Props {
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  partnerName: string;
}

export const UserHeader: React.FC<Props> = ({ currentUser, setCurrentUser, partnerName }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>👤 當前登入身份：</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, currentUser === '男方' && styles.btnBoy]}
          onPress={() => setCurrentUser('男方')}
        >
          <Text style={styles.btnText}>👦 我 (男生)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, currentUser === '女方' && styles.btnGirl]}
          onPress={() => setCurrentUser('女方')}
        >
          <Text style={styles.btnText}>👧 {partnerName} (女友)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 1100, backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 13, fontWeight: '700', color: '#6B5B52' },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#EFE8E1' },
  btnBoy: { backgroundColor: '#4A90E2' },
  btnGirl: { backgroundColor: '#E07A5F' },
  btnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});