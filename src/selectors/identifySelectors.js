
/**
 * This selector return the latest identified features. 
 * It returns the same object returned from QueryService, which is an array of layer
 * features.
 * 
 * @param {*} state 
 */
export const identifySelectFeatures = (state) => 
    state && state.identifyReducer && state.identifyReducer.features;

export const identifySelectCoordinates = (state) => 
    state && state.identifyReducer && state.identifyReducer.coordinates;