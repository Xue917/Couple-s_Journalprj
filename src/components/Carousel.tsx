import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  photos: { id: number; url: string; title: string }[];
}

export const Carousel: React.FC<Props> = ({ photos }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [photos]);

  if (photos.length === 0) return null;
  const current = photos[index];

  return (
    <View style={styles.sideContainer}>
      <View style={styles.polaroidCard}>
        <Image source={{ uri: current.url }} style={styles.image} resizeMode="cover" />
        <Text style={styles.caption}>📸 {current.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sideContainer: {
    width: '100%',
  },
  polaroidCard: {
    width: '100%',
    height: 460,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE8E1',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    flex: 1,
    borderRadius: 16,
  },
  caption: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B5B52',
    fontWeight: '700',
    textAlign: 'center',
  },
});