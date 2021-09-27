import React, { useState } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import CurstomContext from './customContext';

const SESSION_PREFIX = 'FlorianBassani-CustomState';

import Json from '../model/Json';

const CustomState = props => {

    const [browseResults, setBrowseResults] = useState([], 'browseResults', SESSION_PREFIX);
    const [searchResults, setSearchResults] = useStateWithSession([], 'searchResults', SESSION_PREFIX);

    const [searchTerm, setSearchTerm] = useStateWithSession('', 'searchTerm', SESSION_PREFIX);
    const [highlightTerm, setHighlightTerm] = useStateWithSession('', 'highlightTerm', SESSION_PREFIX);

    const [loadingBrowse, setLoadingBrowse] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const [browseError, setBrowseError] = useState(false);

    const [related, setRelated] = useState([]);

    const loadRelated = ({ index, params }) => {
        if (!related[`${params.key}_${params.name}`]) {
            setLoadingRelated({ index, params });
            Json.browse({ index, params }).then(r => {
                setRelated({ ...related, [`${params.key}_${params.name}`]: r });
                setLoadingRelated(false);
            });
        }
    };

    const performBrowse = (index) => {
        setLoadingBrowse(true);
        setBrowseError(false);
        Json.browse({ index }).then(r => {
            if (Array.isArray(r)) {
                setBrowseResults(r);
                setLoadingBrowse(false);
            } else {
                setBrowseResults([]);
                setLoadingBrowse(false);
                setBrowseError(true);
            }
        }).catch(() => {
            setBrowseResults([]);
            setLoadingBrowse(false);
            setBrowseError(true);
        });
    };

    const performSearch = (key) => {
        setLoadingSearch(true);
        Json.search({ key }).then(r => {
            setSearchResults(r);
            setLoadingSearch(false);
        });
    };

    return (
        <CurstomContext.Provider
            value={{
                performBrowse,
                browseResults,
                loadingBrowse,
                performSearch,
                searchResults,
                loadingSearch,
                related,
                loadRelated,
                loadingRelated,
                browseError,
                searchTerm, setSearchTerm,
                highlightTerm, setHighlightTerm
            }}
        >
            {props.children}
        </CurstomContext.Provider>
    );
};

export default CustomState;