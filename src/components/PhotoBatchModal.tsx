import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpload: (images: string[], caption: string) => void;
}

export const PhotoBatchModal: React.FC<Props> = ({ visible, onClose, onUpload }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');

  // 開啟本機相簿選擇多張照片
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('權限不足', '需要相簿存取權限才能挑選照片唷！');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // 允許一次選多張
      quality: 0.8,
    });

    if (!result.canceled) {
      const urls = result.assets.map((asset) => asset.uri);
      setSelectedImages([...selectedImages, ...urls]);
    }
  };

  const handleConfirm = () => {
    if (selectedImages.length === 0) {
      Alert.alert('提示', '請至少選擇一張照片唷！');
      return;
    }
    onUpload(selectedImages, caption);
    // 清空並關閉
    setSelectedImages([]);
    setCaption('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>📷 批量上傳甜蜜照片</Text>

          {/* 選擇照片按鈕 */}
          <TouchableOpacity style={styles.pickBtn} onPress={pickImages}>
            <Text style={styles.pickBtnText}>➕ 從相簿選擇照片</Text>
          </TouchableOpacity>

          {/* 預覽選中的照片列表 */}
          <ScrollView horizontal style={styles.previewRow} showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.deleteBadge}
                  onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* 統一輸入的文字說明 */}
          <Text style={styles.label}>📝 統一文字說明 (每張照片都會帶上這段話)：</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：陽明山浪漫一日遊 💕"
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          {/* 按鈕組 */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleConfirm}>
              <Text style={styles.submitBtnText}>確認發布 ({selectedImages.length} 張)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxWidth: 450, backgroundColor: '#FFFDF9', borderRadius: 24, padding: 20, borderWidth: 2, borderColor: '#FFE8D6' },
  title: { fontSize: 18, fontWeight: '900', color: '#7C6A58', marginBottom: 16, textAlign: 'center' },
  pickBtn: { backgroundColor: '#FFF3E4', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#FFD8BE' },
  pickBtnText: { color: '#8A6D53', fontWeight: '800', fontSize: 14 },
  previewRow: { maxHeight: 100, marginBottom: 16 },
  imageWrapper: { marginRight: 10, position: 'relative' },
  previewImage: { width: 80, height: 80, borderRadius: 12 },
  deleteBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF788E', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  label: { fontSize: 12, fontWeight: '800', color: '#8A6D53', marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#FFE8D6', borderRadius: 12, padding: 10, height: 70, textAlignVertical: 'top', color: '#7C6A58' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, backgroundColor: '#EFEFEF', alignItems: 'center' },
  cancelBtnText: { color: '#666', fontWeight: '800' },
  submitBtn: { flex: 2, paddingVertical: 12, borderRadius: 16, backgroundColor: '#FF788E', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: '900' },
});