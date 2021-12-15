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
                <h4>Naviga per Sommario</h4>
                {
                    toc.map((e, k) => typeof e.link === 'string'
                        ? (
                            <Collapsible
                                key={e.name}
                                highlight={activeChapter == k + 1}
                                header={
                                    <a href={`/book#${e.link}`}>
                                        <h5>{e.name}</h5><span>
                                            <small>{e.subtitle}</small></span>
                                    </a>
                                }
                            />
                        )
                        : (
                            <Collapsible
                                key={e.name}
                                highlight={activeChapter == k + 1}
                                header={<div><h5>{e.name}</h5><span><small>{e.subtitle}</small></span></div>}
                            >
                                {e.link && <ul>{renderLinks(e.link)}</ul>}
                                {e.group && <ul>{e.group.map((group, i) => <li key={i}><a href={`/book#${group.target}`}>{group.name}</a>{group.link && <ul>{renderLinks(group.link)}</ul>}</li>)}</ul>}
                            </Collapsible>
                        ))
                }
            </div>
        </ContextBar>
    );

};