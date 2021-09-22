import React, { useContext } from 'react';


import { ContextBar } from '../template/components/ContextBar.jsx';

import AnalysisContext from '../../context/analysisContext';

import index from '../../../../dataset/toc.json';

import Collapsible from '../template/components/Collapsible.jsx';


const renderLinks = collection => collection.map((e, k) => <li key={k}><a href={`/book#${e.target}`}>{e.label}</a></li>);

export const TocContextBar = ({ visible, toggleBar }) => {

    const { activeChapter } = useContext(AnalysisContext);

    const toc = index.index.group[0].group;

    return (
        <ContextBar visible={visible} toggleBar={toggleBar}>
            <div className="toc-scroller">
                <h4>Table of Contents</h4>
                {
                    toc.map((e, k) => (
                        <Collapsible highlight={activeChapter == k + 1} key={e.name} header={<div><h5>{e.name}</h5><span><small>{e.subtitle}</small></span></div>}>
                            {e.link && <ul>{renderLinks(e.link)}</ul>}
                            {e.group && <ul>{e.group.map((group, i) => <li key={i}><b><a href={`/book#${group.target}`}>{group.name}</a></b> {group.link && <ul>{renderLinks(group.link)}</ul>}</li>)}</ul>}
                        </Collapsible>
                    ))
                }
            </div>
        </ContextBar>
    );

};