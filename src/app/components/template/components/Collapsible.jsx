import React, { useEffect, useState } from 'react';

import './Collapsible.scss';

const BASE_CLASS_NAMES = ['collapsible-root'];

const Collapsible = props => {

    const [collapsed, setCollapsed] = useState(false);
    const [classNames, setClassNames] = useState(BASE_CLASS_NAMES);
    const [highlight, setHighlight] = useState(props.highlight);
    const [loading, setLoading] = useState(props.loading);

    let animationTimer;

    const toggleCollapsed = () => {
        if (!collapsed) {
            setCollapsed(true);
            setClassNames([
                ...classNames,
                'collapsible__collapsed'
            ]);
            animationTimer = setTimeout(() => {
                setClassNames([
                    ...classNames,
                    'collapsible__collapsed',
                    'collapsible__collapsed-finished'
                ]);
            }, 200);
        } else {
            setCollapsed(false);
            setClassNames(BASE_CLASS_NAMES);
            clearTimeout(animationTimer);
        }

        props.onClickHandler && props.onClickHandler(collapsed);
    };

    useEffect(() => setHighlight(props.highlight), [props.highlight]);
    useEffect(() => setLoading(props.loading), [props.loading]);

    const headerClassNames = ['collapsible-header'];

    if (loading) {
        headerClassNames.push('collapsible-header__loading');
    }

    return (
        <div className={classNames.join(' ')}>
            <div className={headerClassNames.join(' ')} onClick={toggleCollapsed}>
                <div className="collapsible-header-loading" />
                {props.header}
                {
                    highlight && <div className="collapsible-header-pointer" />
                }
            </div>

            <div className="collapsible-body">
                {props.children}
            </div>

        </div>
    );
};

export default Collapsible;