import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explorer" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      <Tabs.Screen name="growth" options={{ title: "Croissance" }} />
    </Tabs>
  );
}
