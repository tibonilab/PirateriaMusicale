import React, { useContext, useState, useEffect } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import { BrowserRouter, Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import CurstomContext from '../context/customContext';

import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import Collapsible from '../components/template/components/Collapsible.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';
// import { browse } from '../model/Solr';

// const indexes = () => [
//     { value: 'inventory', label: t('common.indexes.inventory') },
//     { value: 'composer_names', label: t('common.indexes.composer_names') },
//     { value: 'other_names', label: t('common.indexes.other_names') },
//     { value: 'original_call_no', label: t('common.indexes.original_call_no') },
//     { value: 'call_no', label: t('common.indexes.call_no') },
// ];

const indexes = () => [
    { value: 'Names', label: 'Names' },
    // { value: 'Dates', label: 'Dates' },
    // { value: 'Feasts', label: 'Feasts' },
];

const JsonBrowse = () => {

    const { performBrowse, browseResults, loadingBrowse, loadRelated, loadingRelated, related } = useContext(CurstomContext);

    const [selectedIndex, setSelectedIndex] = useStateWithSession('', 'selectedIndex', 'CustomState');
    const [results, setResults] = useStateWithSession([], 'results', 'CustomState');
    const [isButtonDisabled, setIsButtonDisabled] = useState(!/\S/.test(selectedIndex), 'isButtonDisabled', 'CustomState');
    const [buttonLabel, setButtonLabel] = useState(t('browse.form.submit'));
    // const [related, setRelated] = useState({});

    // const appendRelated = (group) => {
    //     setRelated({ ...related, ...group });
    // };

    const selectChangeHandler = value => {
        const testValue = /\S/.test(value);
        setIsButtonDisabled(!testValue);
        testValue && setSelectedIndex(value);
    };

    const isLoadingRelated = (key, name) => loadingRelated && loadingRelated.params.key == key && loadingRelated.params.name == name;

    return (
        <Template>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); performBrowse(selectedIndex); }}>
                <FlexWrapper>
                    <Select
                        value={selectedIndex}
                        placeholder={t('browse.form.select_placeholder')}
                        onChangeHandler={selectChangeHandler}
                        options={indexes()}
                    />
                    <PrimaryButton disabled={loadingBrowse} type="submit">{t(`browse.form.${loadingBrowse ? 'loading' : 'submit'}`)}</PrimaryButton>
                </FlexWrapper>
            </form>
            {
                loadingBrowse
                    ? <FlexWrapper justifyContent="center" alignItems="center" style={{ flexDirection: 'column', height: '70vh' }}>
                        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        <h4>Loading data, please wait..</h4>
                    </FlexWrapper>
                    : browseResults && browseResults/* .slice(0, 3) */.map((e, key) => (
                        <React.Fragment key={e.name}>
                            <Collapsible
                                key={key}
                                header={(<h3 className="collapsible-header-caption" style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>{e.name}</h3>)}
                                onClickHandler={collapsed => !collapsed && loadRelated({ index: selectedIndex, params: { key, name: e.name } })}>

                                {
                                    related[`${key}_${e.name}`] && isLoadingRelated(key, e.name) && <div><div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <h4>Loading data, please wait..</h4></div>
                                }

                                {
                                    related[`${key}_${e.name}`] && (!isLoadingRelated(key, e.name) && related[`${key}_${e.name}`] && Array.isArray(related[`${key}_${e.name}`])) && <div><ul>{
                                        related[`${key}_${e.name}`].map((data, index) => {
                                            console.log(data);

                                            return (
                                                <li key={index}>{data.label} <Link to={`/book#${data.target}`}>Go</Link></li>
                                            )

                                        })}</ul></div>
                                }
                            </Collapsible>

                        </React.Fragment>
                    ))
            }
        </Template >
    );
};

export default JsonBrowse;