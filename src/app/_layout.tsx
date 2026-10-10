import { Stack } from 'expo-router';
import Head from 'expo-router/head';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <>
      <Head>
        <title>0917❤️1224</title>
      </Head>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}