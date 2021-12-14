import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { TocContextBar } from '../shared/TocContextBar.jsx';

import AnalysisContext from '../../context/analysisContext';

import '../../../index.scss';

import './Template.scss';

const Template = props => {

    const contentClassNames = ['template-content'];

    const { isContextBarVisible, toggleContextBar } = useContext(AnalysisContext);

    if (!props.hiddenContextBar && isContextBarVisible) {
        contentClassNames.push('template-content__with-contextBar');
    }

    if (props.boxedCentered != undefined) {
        contentClassNames.push('template-content__boxedCentered');
    }

    return (
        <div className="template-root">
            <Navbar />
            <Sidebar />
            {
                !props.hiddenContextBar && <TocContextBar visible={isContextBarVisible} toggleBar={toggleContextBar} />
            }
            <div className={contentClassNames.join(' ')}>
                {props.children}
            </div>
        </div >
    );

};

export default withRouter(Template);