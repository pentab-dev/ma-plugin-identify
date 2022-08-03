/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - An example of a plugin that listens to another 
 *    plugin's state changes (Map plugin), and log that state.
 */


import React from 'react';
import { connect } from 'react-redux';
import {
    selectorsRegistry,
    actionsRegistry,
    apiRegistry,
    systemAddNotification,
    withLocalize,
    systemShowLoading,
    systemHideLoading,
    systemAddPopup,
    systemUpdatePopup,
    systemRemovePopup,
    query,
    queryDefaultFormatter
} from '@penta-b/ma-lib';

import * as identifyService from '../../services/identifyService';

import IdentifyPopup from '../IdentifyPopup/IdentifyPopup.component';

import { LOCALIZATION_NAMESPACE } from '../../constants/identifyConstants';
import { identifySelectFeatures, identifySelectCoordinates } from '../../selectors/identifySelectors';
import { identifyAddFeatures } from '../../actions/identifyActions';

class IdentifyComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Description: 
     *  - React lifecycle method, here we check for state changes.
     */
    componentDidUpdate(prevProps) {
        const { isActive, addInteraction, removeInteraction, deactivate, features, coordinates } = this.props;

        if (features != prevProps.features) {
            this.doIdentifySuccess(coordinates, features);
        }

        if (isActive && !prevProps.isActive) {
            //addNotification(this.props.t('instruction'), 'info');

            apiRegistry.getApis(['Drawing']).then(([Drawing]) => {

                this.drawing = new Drawing({ type: 'point' });
                this.drawing.setOnDrawFinish((e) => {
                    this.doIdentify(e.getGeometry().coordinates);
                });
                this.drawing.setOnInteractionRemoved(() => {
                    deactivate && deactivate();
                });

                addInteraction(this.drawing);
            });
        } else if (!isActive && prevProps.isActive) {
            this.drawing && removeInteraction(this.drawing);
        }
    }

    doIdentify(coordinates) {
        if (!this.props.settings) return;

        const resolution = this.props.resolution;
        if (!resolution) return;

        const { tolerance, layers } = this.props.settings;

        var extent = identifyService.bufferPoint(coordinates, resolution, tolerance);
        var polygonJson = JSON.stringify(identifyService.extentToPolygon(...extent));

        var queryPrams = layers && layers.map((layer) => {
            var returns = layer.fields && layer.fields.map(function (field) {
                return field;
            });

            if (layer.geometryField) {
                returns.push(layer.geometryField);
            }

            if (layer.nameField && !returns.find(f => f.id === layer.nameField.id)) {
                returns.push(layer.nameField);
            }

            if (layer.idField && !returns.find(f => f.id === layer.idField.id)) {
                returns.push(layer.idField);
            }

            return {
                dataSource: {
                    ...layer.datasource,
                    layerName: layer.layerName
                },
                filter: {
                    conditionList: [{
                        spatialCondition: {
                            key: layer.geometryField.fieldName,
                            geometry: polygonJson,
                            spatialRelation: "INTERSECT"
                        }
                    }]
                },
                returns,
                crs: this.props.projection && this.props.projection.code
            }
        });
        if (!queryPrams) return;

        this.props.showLoading();
        query.queryFeatures(queryPrams, queryDefaultFormatter).then(res => {
            this.props.hideLoading();
            this.props.identifyAddFeatures(res.data, coordinates)
        }).catch(e => {
            this.props.hideLoading();

            var error = 'identify_error';
            if(e.response && e.response.status == 401) {
                error = 'identify_error_auth';
            }
            this.props.addNotification(this.props.t(error), 'error');
        });
    }

    _convertSettingsFieldToBasicField(field, value) {
        return {
            id: field && field.id,
            fieldName: field && field.fieldName,
            alias: field && field.alias,
            value: value,
            displayType: field && field.displayType
        }
    }

    parseQueryResults(res, FeatureConstructor) {
        const { settings } = this.props;

        var features = [];
        res.forEach((layer, index) => {
            const layerSettings = settings && settings.layers && settings.layers[index];
            const nameField = layerSettings && layerSettings.nameField;
            const idField = layerSettings && layerSettings.idField;

            const layerFeatures = layer && layer.features && JSON.parse(layer.features).features;

            layerFeatures && layerFeatures.forEach(f => {
                features.push({
                    id: layerSettings && layerSettings.id,
                    layerName: layerSettings && layerSettings.layerName,
                    alias: layerSettings && layerSettings.alias,
                    geometry: f.geometry,
                    idField: this._convertSettingsFieldToBasicField(idField, f.properties[idField.fieldName]),
                    nameField: this._convertSettingsFieldToBasicField(nameField, f.properties[nameField.fieldName]),
                    fields: layerSettings && layerSettings.fields && layerSettings.fields.map((field) => (
                        this._convertSettingsFieldToBasicField(field, f.properties[field.fieldName])
                    )),
                    feature: new FeatureConstructor(f)
                });
            });
        });

        return features;
    }

    doIdentifySuccess(coordinates, res) {
        this.props.hideLoading();

        apiRegistry.getApis(['Feature']).then(([Feature]) => {
            this.id && this.props.removeIdentifyPopup(this.id);

            var features = res && this.parseQueryResults(res, Feature);

            if (features && features.length) {
                var geometry = features[0].feature.getGeometry();
                var geometryType = geometry && geometry.type;

                var move = true;
                const settings = this.props.settings || {};
                if (settings.hasOwnProperty('move')) {
                    move = settings.move;
                }

                var initialCoordinates = geometryType == 'Point' && move ?
                    identifyService.getFeatureCenter(features[0].feature) :
                    coordinates;

                this.props.showIdentifyPopup({
                    title: this.props.t('title'),
                    data: features,
                    changePopupLocation: move && this.changePopupLocation.bind(this)
                },
                    initialCoordinates,
                    id => this.id = id);
            } else {
                this.props.addNotification(this.props.t('no_result'), 'warning');
            }
        });
    }

    changePopupLocation(feature) {
        this.id && this.props.updateIdentifyPopup(this.id, identifyService.getFeatureCenter(feature));
    }

    render() {
        return null;
    }
}

export default connect(
    (state, { reducerId }) => ({
        resolution: selectorsRegistry.getSelector('selectMapResolution', state, reducerId),
        projection: selectorsRegistry.getSelector('selectMapProjection', state, reducerId),
        features: identifySelectFeatures(state),
        coordinates: identifySelectCoordinates(state)
    }), (dispatch, { reducerId }) => ({
        identifyAddFeatures: (features, coordinates) => dispatch(identifyAddFeatures(features, coordinates)),
        addInteraction: (interaction) => dispatch(actionsRegistry.getActionCreator('addInteraction', interaction, reducerId)),
        removeInteraction: (interaction) => dispatch(actionsRegistry.getActionCreator('removeInteraction', interaction, reducerId)),
        showIdentifyPopup: (props, location, onAdd) => dispatch(systemAddPopup(IdentifyPopup, props, location, onAdd)),
        updateIdentifyPopup: (id, location) => dispatch(systemUpdatePopup(id, null, location)),
        removeIdentifyPopup: (id) => dispatch(systemRemovePopup(id)),
        addNotification: (msg, type) => dispatch(systemAddNotification(msg, type)),
        showLoading: () => dispatch(systemShowLoading()),
        hideLoading: () => dispatch(systemHideLoading())
    })
)(withLocalize(IdentifyComponent, LOCALIZATION_NAMESPACE));