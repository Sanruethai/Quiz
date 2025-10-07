import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api, API_PATHS } from "../../lib/api";
import { useAuth } from "../../lib/auth/AuthContext";

import PostCard from "../components/PostCard";


export default function FeedScreen() {
  const { user, logout } = useAuth();
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizePost = (p) => ({
    id: p.id || p._id,
    content: p.content || p.text || "",
    author: p.author || { name: [p.authorName, p.author_name].find(Boolean) || `${user?.firstname || ""} ${user?.lastname || ""}`.trim() },
    createdAt: p.createdAt || p.createAt || p.created_at,
    likeCount: p.likeCount ?? p.likes?.length ?? p.likes ?? 0,
    liked: !!p.liked,
    comments: p.comments || [],
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(API_PATHS.posts.list);
      const arr = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : data?.posts || []);
      setPosts(arr.map(normalizePost));
    } catch (e) {
      console.log("POSTS ERROR:", e?.response?.status, e?.response?.data);
      Alert.alert("โหลดฟีดไม่สำเร็จ", String(e?.response?.data?.message || e?.message || "Error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const createPost = async () => {
    const body = text.trim();
    if (!body) return;
    try {
      const { data } = await api.post(API_PATHS.posts.create, { content: body });
      const created = normalizePost(data?.data || data || { content: body, id: Date.now() });
      setPosts((prev) => [created, ...prev]);
      setText("");
    } catch (e) {
      Alert.alert("โพสต์ไม่สำเร็จ", String(e?.response?.data?.message || e?.message));
    }
  };

  const toggleLike = async (item) => {
    // optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) } : p))
    );
    try {
      if (item.liked) await api.post(API_PATHS.posts.unlike(item.id));
      else await api.post(API_PATHS.posts.like(item.id));
    } catch (e) {
      // rollback
      setPosts((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, liked: item.liked, likeCount: item.likeCount } : p))
      );
      Alert.alert("กดถูกใจไม่สำเร็จ", String(e?.response?.data?.message || e?.message));
    }
  };

  const addComment = async (item, comment) => {
    // optimistic add
    const newCmt = { id: `tmp-${Date.now()}`, author: { name: `${user?.firstname || "ฉัน"}` }, text: comment };
    setPosts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, comments: [...(p.comments || []), newCmt] } : p))
    );
    try {
      await api.post(API_PATHS.posts.comments.create(item.id), { text: comment });
      // (ถ้าเซิร์ฟเวอร์คืนคอมเมนต์จริง ๆ จะ map ทับได้ที่นี่)
    } catch (e) {
      // rollback
      setPosts((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, comments: (p.comments || []).filter((c) => c.id !== newCmt.id) }
            : p
        )
      );
      Alert.alert("คอมเมนต์ไม่สำเร็จ", String(e?.response?.data?.message || e?.message));
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:"#f8fafc" }}>
      <View style={{ padding:16, gap:10 }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <Text style={{ fontSize:20, fontWeight:"700" }}>ฟีด</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={{ color:"#ef4444", fontWeight:"700" }}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>

        {/* compose box */}
        <View style={{ backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", padding:10, gap:8 }}>
          <TextInput
            placeholder="คุณกำลังทำอะไรอยู่..."
            value={text}
            onChangeText={setText}
            multiline
            style={{ minHeight:60 }}
          />
          <View style={{ flexDirection:"row", justifyContent:"flex-end" }}>
            <TouchableOpacity
              onPress={createPost}
              style={{ backgroundColor:"#4F46E5", paddingVertical:10, paddingHorizontal:16, borderRadius:10 }}>
              <Text style={{ color:"#fff", fontWeight:"700" }}>โพสต์</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ padding:16, gap:12 }}
        data={posts}
        keyExtractor={(it, idx) => String(it.id || idx)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => toggleLike(item)}
            onUnlike={() => toggleLike(item)}
            onAddComment={(c) => addComment(item, c)}
          />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading && (
          <View style={{ alignItems:"center", marginTop:32 }}>
            <Text style={{ color:"#64748b" }}>ยังไม่มีโพสต์</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
