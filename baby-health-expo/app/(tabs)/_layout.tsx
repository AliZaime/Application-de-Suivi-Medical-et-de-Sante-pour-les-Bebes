import { FontAwesome5, MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 1,
          borderTopColor: "gray", 
          elevation: 0,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        },
        tabBarActiveTintColor: "rgb(14, 174, 202)", 
        tabBarInactiveTintColor: "#000", 
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold",
        },
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
