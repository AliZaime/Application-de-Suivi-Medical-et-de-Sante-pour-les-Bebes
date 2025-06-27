import { FontAwesome5, MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 1.5,
          borderTopColor: "#7c5fff55", // violet doux
          backgroundColor: 'rgba(24, 29, 54, 0.92)', // fond nuit translucide
          elevation: 0,
          height: 82,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#7c5fff", // violet vif
        tabBarInactiveTintColor: "#b8c1ec", // lavande claire
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}
    >

     <Tabs.Screen
      name="today"
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="home" color={color} size={size} />
        ),
      }}
    />

      <Tabs.Screen
        name="Suivi"
        options={{
          headerShown: false,
          title: "Suivi",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color={color} size={size} />
          ),
        }}
      />
      

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />


    <Tabs.Screen
        name="more"
        options={{
          title: "More",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
