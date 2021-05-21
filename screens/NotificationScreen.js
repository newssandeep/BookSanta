import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements'
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import SwipeableFlatlist from '../components/SwipeableFlatlist';


export default class NotificationScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            userId : firebase.auth().currentUser.email,
            allNotifications : []
        }
    this.notificationRef = null
    }

    componentDidMount(){
        this.getNotifications()
    }

    componentWillUnmount(){
        this.notificationRef()
    }

    getNotifications = () =>{
        this.notificationRef = db.collection('all_notifications').where('notification_status', '==', 'unread')
        .where('targeted_user_id', '==', this.state.userId)
        .onSnapshot(snapshot =>{
            var allNotifications = []
            snapshot.docs.map(doc =>{
                var notification = doc.data()
                notification['doc_id'] = doc.id
                allNotifications.push(notification)
            })
        this.setState({
            allNotifications : allNotifications
        })
        })
    }

    renderItem = ( {item, i} ) =>{
        return (
        <ListItem
            key={i}
            title={item.book_name}
            subtitle={item.message}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            leftElement={
                <Icon name = "Book" type = 'font-awesome' color = '#696969'/>
            }
            bottomDivider
        />
        )
    }

    keyExtractor = (item, index) => index.toString()

    render(){
        return(
            <View style = {styles.container}>
                <View style = {{flex : 0.1}}>
                    <MyHeader title = "Notifications" navigation = {this.props.navigation}/>
                </View>
                <View style = {{flex : 0.9}}>
                    {this.state.allNotifications.length == 0?(
                        <View style = {{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Text style = {{fontSize : 25}}>You Have no Notifications!</Text>
                        </View>
                    ):(
                        <SwipeableFlatlist allNotifications = {this.state.allNotifications}/>
                    )}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({ container: { flex: 1 } })