import React, { useContext } from 'react';

import { withRouter } from 'react-router-dom';

import { SearchIcon, BrowseIcon, PinIcon, BookIcon } from './Icons.jsx';
import { ClearButton } from './Buttons.jsx';
import AnalysisContext from '../../../context/analysisContext';

import BrowseContext from '../../../context/browseContext';
import SearchContext from '../../../context/searchContext';

import LinkWithTooltip from './LinkWithTooltip.jsx';

const SidebarWithRoute = props => {

    const isActive = (path) => props.location.pathname.includes(path);

    const { pinnedDocuments } = useContext(AnalysisContext);
    const browseContext = useContext(BrowseContext);
    const searchContext = useContext(SearchContext);

    return (
        <div className="sidebar-root">
            <LinkWithTooltip to="/book" content="Consulta il libro">
                <ClearButton isActive={isActive('book')}>
                    <BookIcon />
                </ClearButton>
            </LinkWithTooltip>

            <LinkWithTooltip onClick={() => { searchContext.unsetSearchSelected ? searchContext.unsetSearchSelected() : false; }} to="/search" content="Cerca nel testo">
                <ClearButton isActive={isActive('search')}>
                    <SearchIcon />
                </ClearButton>
            </LinkWithTooltip>

            <LinkWithTooltip onClick={() => { browseContext.unsetSearchResults ? browseContext.unsetSearchResults() : false; browseContext.unsetSearchSelected ? browseContext.unsetSearchSelected() : false; }} to="/browse" content="Sfoglia l'indice">
                <ClearButton isActive={isActive('browse')}>
                    <BrowseIcon />
                </ClearButton>
            </LinkWithTooltip>

            {/* <Link to="/pin">
                <ClearButton isActive={isActive('pin')}>
                    {pinnedDocuments.length > 0 && <span className="badge">{pinnedDocuments.length}</span>}
                    <PinIcon />
                </ClearButton>
            </Link> */}
        </div>
    );
};

export const Sidebar = withRouter(SidebarWithRoute);