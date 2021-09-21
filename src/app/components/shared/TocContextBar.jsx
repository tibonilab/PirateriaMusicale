import React from 'react';


import { ContextBar } from '../template/components/ContextBar.jsx';

import AnalysisContext from '../../context/analysisContext';

import index from '../../../../dataset/toc.json';

import Collapsible from '../template/components/Collapsible.jsx';


export const TocContextBar = ({ visible, toggleBar }) => {

    const toc = index.index.group[0].group;

    console.log(toc);

    return (
        <ContextBar visible={visible} toggleBar={toggleBar}>
            <div className="toc-scroller">
                <h4>Table of Contents</h4>
                {toc.map(e => <Collapsible key={e.name} header={<div><h5>{e.name}</h5><span><small>{e.subtitle}</small></span></div>}>
                    {e.link && <ul>{e.link.map((link, k) => {
                        console.log(link.label);
                        return <li key={k}><a href={`/book#${link.target}`}>{link.label.replace(' ', '\u00a0')}</a></li>;
                    })}</ul>}
                </Collapsible>)}
            </div>
        </ContextBar>
    );

};