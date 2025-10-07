import React from "react";
import { Text, View } from "react-native";

export default class ErrorBoundary extends React.Component {
  state = { hasError:false, error:null };
  static getDerivedStateFromError(error){ return { hasError:true, error }; }
  componentDidCatch(error, info){ console.error("ErrorBoundary:", error, info); }
  render(){
    if(this.state.hasError){
      return <View style={{flex:1,alignItems:"center",justifyContent:"center",padding:16}}>
        <Text style={{fontWeight:"700",fontSize:18}}>มีข้อผิดพลาดในหน้า</Text>
        <Text selectable style={{marginTop:8,color:"#6b7280"}}>{String(this.state.error)}</Text>
      </View>;
    }
    return this.props.children;
  }
}
