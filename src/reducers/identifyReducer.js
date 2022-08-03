import { IDENTIFY_ADD_FEATURES } from "../actions/identifyActions"

const initialState = {
    features: [],
    coordinates: null
}

export default function identifyReducer(state = initialState, action) {
    if(action.type == IDENTIFY_ADD_FEATURES) {
        const { features, coordinates } = action.payload;

        return {
            ...state,
            features,
            coordinates   
        }
    }

    return state;
}