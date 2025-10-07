import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign:"center" }}>
      <Tabs.Screen name="index" options={{ title:"ฟีด" }} />
      <Tabs.Screen name="members" options={{ title:"สมาชิก" }} />
    </Tabs>
  );
}
