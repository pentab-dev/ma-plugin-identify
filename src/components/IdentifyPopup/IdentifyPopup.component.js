import React from 'react';

import { BasicInfo, componentRegistry, withLocalize } from '@penta-b/ma-lib';
import { LOCALIZATION_NAMESPACE } from '../../constants/identifyConstants';

const ExtraButtons = [{
    Component: componentRegistry.getComponent('AddToSelection'),
    props: {}
}, {
    Component: componentRegistry.getComponent('RemoveFromSelection'),
    props: {}
}]

class IdentifyPopup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    createNameList() {
        const { data } = this.props;

        return data && data.map((feature, index) => {
            if (!feature) return null;

            return feature.alias && <option key={index} value={index}>{feature.alias}</option>;
        }).filter((option) => {
            return option;
        });
    }

    createDataList() {
        const { selectedIndex } = this.state;
        const { data } = this.props;

        if (!data || !data[selectedIndex]) {
            return;
        }

        var feature = data[selectedIndex];

        var properties = feature.getProperties();
        return Object.keys(properties).map((fieldName) => {
            return (
                <div key={fieldName} className="penta-item">
                    <span>
                        {fieldName}:
                    </span>
                    <span>
                        {properties[fieldName]}
                    </span>
                </div>
            );
        });
    }

    selectedFeatureChanged(e) {
        var selectedIndex = e.target.value;
        
        this.props.changePopupLocation &&
            this.props.changePopupLocation(this.props.data[selectedIndex].feature);

        this.setState({ selectedIndex });
    }

    render() {
        const { selectedIndex } = this.state;
        const { data, t } = this.props;

        const selectedData = data && data[selectedIndex];
        return (
            <React.Fragment>
                {
                    data && data.length > 1 &&
                    <div className="penta-form-item">
                        <label>{t('feature_name_label')}</label>
                        <select onChange={this.selectedFeatureChanged.bind(this)}>
                            {
                                data && data.map((f, index) => (
                                    <option key={index} value={index}>
                                        {f.alias + " - " + (f.nameField.value || f.idField.value)}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                }
                {
                    data && data.length == 1 &&
                    <div className="penta-key-value">
                        <div className="penta-item">
                            <span>{t('feature_name_label')}</span>
                            <span>{selectedData.alias + " - " + (selectedData.nameField.value || selectedData.idField.value)}</span>
                        </div>
                    </div>
                }
                <BasicInfo {...selectedData} extraButtons={ExtraButtons} />

            </React.Fragment>
        );
    }
}

export default withLocalize(IdentifyPopup, LOCALIZATION_NAMESPACE);