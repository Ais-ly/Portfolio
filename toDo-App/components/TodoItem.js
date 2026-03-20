import React , {useState,useEffect} from "react";
import { View,Switch, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';

export default function TodoItem(props){
       const [done, setDone] = useState(props.item.done);
        const toggleSwitch = (value) => {
          
            setDone(value);
            
            props.onPressed(props.item.id,value);  
        };
        useEffect(() => {
            setDone(props.item.done)
          
        }, [props.item.done]);
          console.log(props);
   return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Switch 
                    value={done} 
                    onValueChange={toggleSwitch} 
                    trackColor={{ false: "#ccc", true: "#4CAF50" }}
                    thumbColor={done ? "#2E7D32" : "#f4f3f4"}
                />
                <Text style={[styles.text, done && styles.doneText]}>
                    {props.item.content}
                </Text>
            </View>

            <View style={styles.actions}>

                <TouchableOpacity onPress={() => props.deleteTodo(props.item.id)}>
                    <Image
                        source={require('../assets/poubelle.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF9F0', 
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
        color: "#4B3B2A", 
    },
    doneText: {
        textDecorationLine: 'line-through',
        color: "#A18977", 
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 28,
        height: 28,
        marginLeft: 15,
        tintColor: "#8B5E3C", 
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], 
    }
});
