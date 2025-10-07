import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PostCard({ post, onLike, onUnlike, onAddComment }) {
  const [comment, setComment] = useState("");
  const liked = !!post.liked;
  const likeCount = post.likeCount ?? post.likes?.length ?? post.likes ?? 0;
  const author = post.author?.name || post.authorName || "ผู้ใช้";
  const time = post.createdAt || post.createAt;

  return (
    <View style={{ backgroundColor:"#fff", borderRadius:12, padding:12, borderWidth:1, borderColor:"#e5e7eb" }}>
      <View style={{ flexDirection:"row", justifyContent:"space-between" }}>
        <Text style={{ fontWeight:"700" }}>{author}</Text>
        {time && <Text style={{ color:"#64748b", fontSize:12 }}>{new Date(time).toLocaleString()}</Text>}
      </View>

      <Text style={{ marginTop:8, lineHeight:20 }}>{post.content}</Text>

      <View style={{ flexDirection:"row", gap:10, marginTop:10 }}>
        <TouchableOpacity
          onPress={liked ? onUnlike : onLike}
          style={{ paddingVertical:6, paddingHorizontal:12, borderWidth:1, borderColor:"#e5e7eb", borderRadius:8, backgroundColor: liked ? "#eef2ff" : "#fff" }}>
          <Text style={{ fontWeight:"600" }}>{liked ? "ยกเลิกถูกใจ" : "ถูกใจ"} ({likeCount})</Text>
        </TouchableOpacity>
        <Text style={{ alignSelf:"center", color:"#64748b" }}>
          ความคิดเห็น {post.comments?.length || 0}
        </Text>
      </View>

      {(post.comments || []).map((c, idx) => (
        <View key={c.id || c._id || idx} style={{ backgroundColor:"#f8fafc", borderWidth:1, borderColor:"#e5e7eb", borderRadius:8, padding:8, marginTop:8 }}>
          <Text style={{ fontWeight:"600" }}>{c.author?.name || c.authorName || "ผู้ใช้"}</Text>
          <Text>{c.text || c.content}</Text>
        </View>
      ))}

      <View style={{ flexDirection:"row", gap:8, marginTop:10 }}>
        <TextInput
          placeholder="แสดงความคิดเห็น..."
          value={comment}
          onChangeText={setComment}
          style={{ flex:1, borderWidth:1, borderColor:"#e5e7eb", borderRadius:8, paddingHorizontal:10, paddingVertical:8 }}
        />
        <TouchableOpacity
          onPress={() => { if(comment.trim()){ onAddComment(comment.trim()); setComment(""); } }}
          style={{ backgroundColor:"#0f172a", paddingHorizontal:14, justifyContent:"center", borderRadius:8 }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>ส่ง</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
