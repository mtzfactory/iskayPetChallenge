import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';

import App from '~/app';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
