import {createStackNavigator} from 'react-navigation-stack'
import BookDonateScreen from '../screens/BookDonateScreen'
import RecieverDetailScreen from '../screens/RecieverDetailScreen'

export const AppStackNavigator = createStackNavigator({
    BookDonateList : {
        screen: BookDonateScreen,
        navigationOptions : {headerShown : false}
    },
    RecieverDetail : {
        screen : RecieverDetailScreen,
        navigationOptions : {headerShown : false}
    },
    },
    {
      initialRouteName : 'BookDonateList'
    }
)