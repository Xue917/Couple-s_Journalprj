import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabaseClient'; // ⚠️ 請確保路徑指向你初始化 Supabase 的檔案

interface Props {
  onLogin: (role: 'male' | 'female', userData: any) => void;
}

export const LoginModal: React.FC<Props> = ({ onLogin }) => {
  
  // 處理點擊登入邏輯
  const handleGenderLogin = async (gender: 'male' | 'female') => {
    try {
      // 1. 從 profiles 資料表抓取對應性別的第一筆資料
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('gender', gender)
        .maybeSingle();

      if (error) throw error;

      // 2. 如果資料庫還沒有這個性別的使用者，自動幫他建立一筆預設資料
      if (!profile) {
        const defaultNickname = gender === 'male' ? '男生小幫手' : '女生小幫手';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              gender: gender,
              nickname: defaultNickname,
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      // 3. 成功取得/建立資料後，執行登入成功的回傳
      onLogin(gender, profile);

    } catch (err: any) {
      Alert.alert('登入失敗', err.message || '請檢查網路或 Supabase 設定');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>💕 雙人足跡地圖</Text>
        <Text style={styles.subtitle}>請選擇您今天的登入身份</Text>

        <TouchableOpacity 
          style={[styles.loginBtn, styles.maleBtn]} 
          onPress={() => handleGenderLogin('male')}
        >
          <Text style={styles.btnText}>🦁 我是男生</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginBtn, styles.femaleBtn]} 
          onPress={() => handleGenderLogin('female')}
        >
          <Text style={styles.btnText}>🏵️ 我是女生</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed' as any,
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: '#FAF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  card: {
    width: 320,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#5C4D44', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#8C7A6B', marginBottom: 24 },
  loginBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  maleBtn: { backgroundColor: '#4A90E2' },
  femaleBtn: { backgroundColor: '#E07A5F' },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});