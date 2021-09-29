import React from 'react';

import FlexWrapper from './FlexWrapper.jsx';

import { t } from '../../../i18n';

export const Loading = ({ height }) => (
    <FlexWrapper justifyContent="center" alignItems="center" style={{ flexDirection: 'column', height: height || '70vh' }}>
        <div className="lds-spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
        <h4 style={{ paddingTop: '1em' }}>
            {t('browse.results.loading')}
        </h4>
    </FlexWrapper>
);

export default Loading;