import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth/AuthContext";


export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try { await login(username, password); }
    catch (e) { Alert.alert("เข้าสู่ระบบไม่สำเร็จ", String(e?.message || e)); }
  };

  return (
    <SafeAreaView style={{ flex:1, justifyContent:"center", padding:16 }}>
      <Text style={{ fontSize:24, fontWeight:"800", marginBottom:16 }}>เข้าสู่ระบบ</Text>
      <TextInput value={username} onChangeText={setUsername} placeholder="อีเมลหรือชื่อผู้ใช้"
        style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:10, padding:12, marginBottom:12 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="รหัสผ่าน" secureTextEntry
        style={{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:10, padding:12, marginBottom:12 }} />
      <TouchableOpacity onPress={onSubmit} style={{ backgroundColor:"#4F46E5", padding:14, borderRadius:10 }}>
        <Text style={{ color:"#fff", fontWeight:"700", textAlign:"center" }}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
