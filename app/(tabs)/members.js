import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api, API_PATHS } from "../../lib/api";


function MemberRow({ item }) {
  const full = [item.firstname, item.lastname].filter(Boolean).join(" ");
  const sid  = item.education?.studentId || item.studentId;
  const major= item.education?.major || item.major;
  return (
    <View style={{ backgroundColor:"#fff", borderRadius:12, padding:12, borderWidth:1, borderColor:"#e5e7eb" }}>
      <Text style={{ fontWeight:"700" }}>{full || item.email || "ไม่ระบุชื่อ"}</Text>
      {sid && <Text style={{ color:"#475569", marginTop:4 }}>รหัส: {sid}</Text>}
      {major && <Text style={{ color:"#64748b", marginTop:2 }}>{major}</Text>}
    </View>
  );
}

export default function MembersScreen() {
  const [year, setYear] = useState("2565");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (y) => {
    setLoading(true);
    try {
      const { data } = await api.get(API_PATHS.membersByYear(y));
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : data?.members || []);
      setData(list);
    } catch (e) {
      console.log("MEMBERS ERROR:", e?.response?.status, e?.response?.data);
      Alert.alert("โหลดรายชื่อไม่สำเร็จ", String(e?.response?.data?.message || e?.message || "Error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(year); }, []);

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:"#f8fafc" }}>
      <View style={{ padding:16, gap:10 }}>
        <Text style={{ fontSize:20, fontWeight:"700" }}>สมาชิกตามชั้นปี</Text>
        <View style={{ flexDirection:"row", gap:8 }}>
          <TextInput
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
            style={{ flex:1, borderWidth:1, borderColor:"#e5e7eb", borderRadius:10, paddingHorizontal:12, paddingVertical:10, backgroundColor:"#fff" }}
            placeholder="เช่น 2565"
          />
          <TouchableOpacity
            onPress={() => load(year)}
            style={{ backgroundColor:"#4F46E5", paddingHorizontal:16, borderRadius:10, justifyContent:"center" }}>
            <Text style={{ color:"#fff", fontWeight:"700" }}>ค้นหา</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding:16, gap:10 }}
        data={data}
        keyExtractor={(it, idx) => String(it._id || it.id || it.email || it.studentId || idx)}
        renderItem={({ item }) => <MemberRow item={item} />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(year)} />}
        ListEmptyComponent={!loading && (
          <View style={{ alignItems:"center", marginTop:32 }}>
            <Text style={{ color:"#64748b" }}>ไม่พบข้อมูล</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
