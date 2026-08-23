import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { PostItem, UserType } from '../types';

interface PostFeedProps {
  posts: PostItem[];
  currentUser: UserType;
  partnerName: string;
  onAddPost: (content: string, imageUrl?: string) => void;
  onAddComment: (postId: number, text: string) => void;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  currentUser,
  partnerName,
  onAddPost,
  onAddComment,
}) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  // 🌸 控制「詢問是否同步相簿」的 Modal
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [pendingPostData, setPendingPostData] = useState<{ content: string; image: string } | null>(null);

  // 📷 從本機相簿選擇照片
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('權限不足', '請開放相簿存取權限以選擇照片唷！');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 🌸 點擊「發布貼文」
  const handlePublishClick = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert('提示', '請輸入想說的話或選擇一張照片唷！');
      return;
    }

    // 如果有選照片，跳出 Modal 詢問是否同步
    if (selectedImage) {
      setPendingPostData({ content, image: selectedImage });
      setShowSyncModal(true);
    } else {
      // 沒照片直接發布
      onAddPost(content, undefined);
      setContent('');
      setSelectedImage(null);
    }
  };

  // 🌸 使用者在 Modal 選擇「是，同步存到相簿」
  const handleConfirmSync = () => {
    if (pendingPostData) {
      onAddPost(pendingPostData.content, pendingPostData.image);
    }
    setShowSyncModal(false);
    setPendingPostData(null);
    setContent('');
    setSelectedImage(null);
  };

  // 🌸 使用者在 Modal 選擇「否，僅發布動態」
  const handleCancelSync = () => {
    if (pendingPostData) {
      // 這邊發布時不帶傳給相簿的邏輯（或者 onAddPost 內部處理）
      onAddPost(pendingPostData.content, undefined);
    }
    setShowSyncModal(false);
    setPendingPostData(null);
    setContent('');
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📸 我們的悄悄話貼文牆 (IG風)</Text>

      {/* 發布貼文區塊 */}
      <View style={styles.createCard}>
        <TextInput
          style={styles.contentInput}
          placeholder="今天想對對方說什麼...？"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* 相簿選擇按鈕 */}
        <TouchableOpacity style={styles.pickImageBtn} onPress={pickImage}>
          <Text style={styles.pickImageBtnText}>
            {selectedImage ? '📷 已選擇照片 (點擊替換)' : '🖼️ 從本機相簿選擇照片'}
          </Text>
        </TouchableOpacity>

        {/* 預覽選擇的照片 */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageText}>✕ 移除</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handlePublishClick}>
          <Text style={styles.submitBtnText}>發布貼文 ✨</Text>
        </TouchableOpacity>
      </View>

      {/* 貼文列表 */}
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Text style={styles.postAuthor}>👤 {post.author}</Text>
            <Text style={styles.postTime}>{post.createdAt}</Text>
          </View>

          {post.content ? <Text style={styles.postContent}>{post.content}</Text> : null}

          {post.imageUrl ? (
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          ) : null}

          {/* 留言區 */}
          <View style={styles.commentSection}>
            {post.comments.map((c) => (
              <Text key={c.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{c.author}：</Text>
                {c.text}
              </Text>
            ))}

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="留言..."
                value={commentInputs[post.id] || ''}
                onChangeText={(text) =>
                  setCommentInputs({ ...commentInputs, [post.id]: text })
                }
              />
              <TouchableOpacity
                style={styles.commentSendBtn}
                onPress={() => {
                  if (commentInputs[post.id]?.trim()) {
                    onAddComment(post.id, commentInputs[post.id]);
                    setCommentInputs({ ...commentInputs, [post.id]: '' });
                  }
                }}
              >
                <Text style={styles.commentSendText}>傳送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* 🌸 強制跳出的同步詢問視窗 */}
      <Modal visible={showSyncModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📸 相簿同步詢問</Text>
            <Text style={styles.modalSubTitle}>
              要將這張照片同步儲存到左右兩側的「相簿照片牆」嗎？
            </Text>

            {pendingPostData?.image && (
              <Image source={{ uri: pendingPostData.image }} style={styles.syncPreviewImage} />
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCancelSync}>
                <Text style={styles.modalCancelText}>否，僅發布動態</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmSync}>
                <Text style={styles.modalConfirmText}>是，同步存到相簿 💕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#7C6A58', marginBottom: 12 },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFE8D6',
  },
  contentInput: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    borderWidth: 2,
    borderColor: '#FFE8D6',
    minHeight: 60,
    marginBottom: 10,
    color: '#7C6A58',
  },
  pickImageBtn: {
    backgroundColor: '#FFF3E4',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#FFD8BE',
  },
  pickImageBtnText: { color: '#8A6D53', fontWeight: '800', fontSize: 13 },
  previewContainer: { position: 'relative', marginBottom: 10, alignItems: 'center' },
  previewImage: { width: '100%', height: 180, borderRadius: 12 },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  removeImageText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: '#E7846B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE8D6',
  },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  postAuthor: { fontWeight: '800', color: '#7C6A58', fontSize: 14 },
  postTime: { fontSize: 11, color: '#A0836B' },
  postContent: { fontSize: 14, color: '#5A463C', marginBottom: 10 },
  postImage: { width: '100%', height: 220, borderRadius: 14, marginBottom: 10 },
  commentSection: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#FFF3E4' },
  commentItem: { fontSize: 12, color: '#7C6A58', marginBottom: 4 },
  commentAuthor: { fontWeight: '700' },
  commentInputRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#FFE8D6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
  },
  commentSendBtn: { backgroundColor: '#FF788E', borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center' },
  commentSendText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  // Modal 樣式
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 340, backgroundColor: '#FFFDF9', borderRadius: 24, padding: 20, borderWidth: 3, borderColor: '#FFE8D6', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#7C6A58', marginBottom: 8 },
  modalSubTitle: { fontSize: 13, color: '#8A6D53', textAlign: 'center', marginBottom: 14, fontWeight: '600' },
  syncPreviewImage: { width: '100%', height: 140, borderRadius: 12, marginBottom: 16 },
  modalBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalCancelBtn: { flex: 1, backgroundColor: '#EFEFEF', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  modalCancelText: { color: '#666', fontSize: 12, fontWeight: '800' },
  modalConfirmBtn: { flex: 1.2, backgroundColor: '#FF788E', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  modalConfirmText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
});