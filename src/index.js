/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - This index file exports plugin's components and/or reducers and/or actions.
 */

import Identify from './components/Identify/Identify.component';
import identifyReducer from './reducers/identifyReducer';
import * as actions from './actions/identifyActions';
import * as selectors from './selectors/identifySelectors';
import {LOCALIZATION_NAMESPACE} from './constants/identifyConstants';

import defaultLocalization from './messages';

Identify.Title = LOCALIZATION_NAMESPACE + ":title";
Identify.Icon = LOCALIZATION_NAMESPACE + ":icon";

const components = {
    Identify
};

const localization = {
    namespace: LOCALIZATION_NAMESPACE,
    defaultLocalization    
};

const reducers = {
    identifyReducer
}

export { components, localization, reducers, actions, selectors };