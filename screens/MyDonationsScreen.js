import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {ListItem, Icon, Card} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { FlatList } from 'react-native-gesture-handler';


export default class MyDonationsScreen extends Component{
    constructor(){
        super()
        this.state = {
            donorName : '',
            userId : firebase.auth().currentUser.email,
            allDonations : []
        }
        this.requestRef = null
    }

    componentDidMount(){
        this.getAllDonations()
        this.getDonorDetails(this.state.userId)
    }

    keyExtractor = (item, index) => index.toString()

    getDonorDetails = (donorId) =>{
        db.collection('users').where('email_id', '==', donorId).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                this.setState({
                    donorName : doc.data().first_name+' '+doc.data().last_name
                })
            })
        })
    }

    sendBook = (bookDetails) =>{
        if (bookDetails.request_status == "Book Sent"){
            var requestStatus = "Donor Interested"
            db.collection('all_donations').doc(bookDetails.doc_id).update({
                request_status : requestStatus
            })
            this.sendNotification(bookDetails, requestStatus)
        }
        else{
            var requestStatus = "Book Sent"
            db.collection('all_donations').doc(bookDetails.doc_id).update({
                request_status : requestStatus
            })
            this.sendNotification(bookDetails, requestStatus)
        }
    }

    renderItem = ( {item, i} ) =>{
        return (
        <ListItem
            key={i}
            title={item.book_name}
            subtitle={'Requested By: ' + item.requested_by + '\n Status: ' + item.request_status}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            leftElement={
                <Icon name = "Book" type = 'font-awesome' color = '#696969'/>
            }
            rightElement={
                <TouchableOpacity style={[styles.button, {backgroundColor : item.request_status=="Book Sent"?'green':'#ff5722'}]}
                onPress = {()=>{this.sendBook(item)}}
                >
                <Text style={{color:'#ffff'}}>
                    {item.request_status=="Book Sent"?'Book Sent':'Send Book'}
                </Text>
                </TouchableOpacity>
            }
            bottomDivider
        />
        )
    }


    sendNotification = (bookDetails, requestStatus) =>{
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection('all_notifications').where('request_id', '==', requestId).where('donor_id', '==', donorId).get()
        .then(snapshot =>{
            snapshot.forEach(doc =>{
                var message = ''
                if (requestStatus == 'Book Sent'){
                    message = this.state.donorName+' has sent you the book!'
                }
                else{
                    message = this.state.donorName+' has shown interest in the book!'
                }
                db.collection('all_notifications').doc(doc.id).update({
                    message : message,
                    notification_status : 'unread',
                    date : firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }


    getAllDonations = () =>{
        this.requestRef = db.collection('all_donations').where('donor_id', '==', this.state.userId)
        .onSnapshot((snapshot) =>{
            var allDonations = []
            snapshot.docs.map(doc =>{
                var donation = doc.data()
                donation['doc_id'] = doc.id
                allDonations.push(donation)
            })
            this.setState({allDonations : allDonations})
        })
    }

    render(){
        return(
            <View style = {{flex : 1}}>
                <MyHeader title = "My Donations"/>
                <View style = {{flex : 1}}>
                    {this.state.allDonations.length == 0?(
                        <View style = {styles.subtitle}>
                            <Text style = {{fontSize : 20}}>List of All Book Donations</Text>
                        </View>
                    ):(
                        <FlatList
                        keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem = {this.renderItem}
                        />
                    )}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    button:{
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: 
        { 
            width: 0, 
            height: 8 
        }, 
        elevation : 16 
    }, 
    subtitle :{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' } 
    })