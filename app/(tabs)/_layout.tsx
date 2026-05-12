import { Tabs } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function TabsLayout(){
  return <Tabs initialRouteName='courts' screenOptions={{headerShown:false,tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:'#9a8d95',tabBarStyle:{backgroundColor:'#fff',borderTopColor:'#efe5e9',height:70,paddingBottom:10,paddingTop:8,shadowColor:'#000',shadowOpacity:0.08,shadowRadius:12}}}>
    <Tabs.Screen name='courts' options={{title:'Play'}}/>
    <Tabs.Screen name='leaderboard' options={{title:'Rankings'}}/>
    <Tabs.Screen name='submit' options={{title:'Submit'}}/>
    <Tabs.Screen name='challenges' options={{title:'Challenges'}}/>
    <Tabs.Screen name='profile' options={{title:'Profile'}}/>
    <Tabs.Screen name='index' options={{href:null}}/>
  </Tabs>
}
