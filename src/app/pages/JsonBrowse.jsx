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

const indexes = () => [
    { value: 'Composers', label: 'Compositori' },
    { value: 'Toc', label: 'Sommario' },
];

const JsonBrowse = () => {

    const {
        performBrowse,
        browseResults,
        loadingBrowse,
        loadRelated,
        loadingRelated,
        related,
        browseError
    } = useContext(CurstomContext);

    const [selectedIndex, setSelectedIndex] = useStateWithSession('', 'selectedIndex', 'CustomState');

    const selectChangeHandler = value => {
        const testValue = /\S/.test(value);
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
                    : browseError
                        ? <div>{'Unable to load index data'}</div>
                        : browseResults && browseResults/* .slice(0, 3) */.map((e, key) => {
                            // console.log(e); 
                            return (
                                <React.Fragment key={e.name}>
                                    <Collapsible
                                        key={key}
                                        header={(
                                            <h3 className="collapsible-header-caption" style={{ borderBottom: '1px solid #e8e8e8', display: 'block', width: '100%', paddingBottom: '.5em' }}>
                                                {e.name}

                                                {
                                                    e.subtitle && <span style={{ padding: '.3em 0 0 1.2em', display: 'block', fontSize: '80%', color: '#999' }}>{e.subtitle}</span>
                                                }
                                            </h3>
                                        )}
                                        onClickHandler={collapsed => !collapsed && loadRelated({ index: selectedIndex, params: { key, name: e.name } })}>

                                        {
                                            isLoadingRelated(key, e.name) && <div><div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                <h4>Loading data, please wait..</h4></div>
                                        }

                                        {
                                            related[`${key}_${e.name}`] && (!isLoadingRelated(key, e.name) && related[`${key}_${e.name}`] && Array.isArray(related[`${key}_${e.name}`])) && <div><ul>{
                                                related[`${key}_${e.name}`].map((data, index) => {
                                                    // console.log(data);

                                                    if (data.target) {
                                                        return (
                                                            <li key={index}>{data.label} <Link to={`/book#${data.target}`}>Go</Link></li>
                                                        );
                                                    }

                                                    return (
                                                        <li key={index}>
                                                            {data.name}
                                                            <ul>
                                                                {data.link.map((link, i) => <li key={i}>{link.label} <Link to={`/book#${link.target}`}>Go</Link></li>)}
                                                            </ul>
                                                        </li>
                                                    );

                                                })}</ul></div>
                                        }
                                    </Collapsible>

                                </React.Fragment>
                            );
                        })
            }
        </Template >
    );
};

export default JsonBrowse;