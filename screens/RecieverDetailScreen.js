import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {Card, Header, Icon} from 'react-native-elements'
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'


export default class RecieverDetailScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            userId : firebase.auth().currentUser.email,
            username : '',
            recieverId : this.props.navigation.getParam('details')['user_id'],
            requestId : this.props.navigation.getParam('details')['request_id'],
            bookName : this.props.navigation.getParam('details')['book_name'],
            reason_for_requesting : this.props.navigation.getParam('details')['reason_to_request'],
            recieverName : '',
            recieverContact : '',
            recieverAddress : '',
            recieverRequestDocId : ''
        }
    }

    componentDidMount(){
        this.getRecieverDetails()
        this.getUserDetails(this.state.userId)
    }


    getRecieverDetails(){
        db.collection('users').where('email_id', '==', this.state.recieverId).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                this.setState({
                    recieverName : doc.data().first_name,
                    recieverContact : doc.data().contact,
                    recieverAddress : doc.data().address
                })
            })
        })
        db.collection('requested_books').where('request_id', '==', this.state.requestId).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                this.setState({
                    recieverRequestDocId : doc.id
                })
            })
        })
    }


    getUserDetails = (userId) =>{
        db.collection('users').where('email_id', '==', userId).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                this.setState({
                    username : doc.data().first_name+' '+doc.data().last_name
                })
            })
        })
    }


    addNotification = () =>{
        var message = this.state.username+' has shown interest in donating the book!'
        db.collection('all_notifications').add({
            targeted_user_id : this.state.recieverId,
            donor_id : this.state.userId,
            book_name : this.state.bookName,
            date : firebase.firestore.FieldValue.serverTimestamp(),
            notification_status : 'unread',
            message : message
        })
    }


    updateBookStatus = () =>{
        db.collection('all_donations').add({
            book_name : this.state.bookName,
            request_id : this.state.requestId,
            requested_by : this.state.recieverName,
            donor_id : this.state.userId,
            request_status : 'Donor Interested'
        })
    }

    render(){
        return(
            <ScrollView style = {styles.container}>
                <View style = {{flex : 0.1}}>
                    <Header 
                    leftComponent = {<Icon name = 'arrow-left' type = 'feather' color = '#696969' onPress = {() =>{this.props.navigation.goBack()}} />} 
                    centerComponent = {{text : 'Donate Books', style : {color : '#000000', fontSize : 20, fontWeight : 'bold'}}}
                    backgroundColor = '#eaf8fe'
                    />
                </View>
                <View style = {{flex : 0.3}}>
                    <Card title = "Book Information" titleStyle = {{fontSize : 20}}>
                        <Card>
                            <Text style = {{fontWeight : 'bold'}}>Name : {this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight : 'bold'}}> Reason : {this.state.reason_for_requesting}</Text>
                        </Card>
                    </Card>
                </View>
                <View style = {{flex : 0.3}}>
                    <Card title = "Reciever Information" titleStyle = {{fontSize : 20}}>
                        <Card>
                            <Text style = {{fontWeight : 'bold'}}>Name : {this.state.recieverName}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight : 'bold'}}>Contact : {this.state.recieverContact}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight : 'bold'}}>Address : {this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style = {styles.buttonContainer}>
                    {this.state.recieverId !== this.state.userId
                    ?(
                        <TouchableOpacity style = {styles.button} onPress = {() =>{
                            this.updateBookStatus()
                            this.addNotification()
                            this.props.navigation.navigate('MyDonations')
                            }}>
                            <Text style = {styles.buttonText}>
                                I want to Donate!
                            </Text>
                        </TouchableOpacity>
                    ):null}
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    buttonContainer:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    },
    buttonText:{
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
      }
  })