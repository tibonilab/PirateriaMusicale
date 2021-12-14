import React, { useContext } from 'react';
import { useStateWithSession } from '../service/serviceStorage';

import { Link } from 'react-router-dom';

import Template from '../components/template/Template.jsx';

import CurstomContext from '../context/customContext';

import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';
import Collapsible from '../components/template/components/Collapsible.jsx';
import Loading from '../components/template/components/Loading.jsx';

import { PrimaryButton } from '../components/template/components/Buttons.jsx';

import { t } from '../i18n';

const indexes = () => [
    { value: 'Composers5', label: 'Compositori e Autori - Depositi' },
    { value: 'Composers6', label: 'Compositori e Autori - Cataloghi' },
    // { value: 'Toc', label: 'Sommario' },
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

    // const loadingBrowse = true;
    console.log(loadingRelated);

    const [selectedIndex, setSelectedIndex] = useStateWithSession('', 'selectedIndex', 'CustomState');

    const selectChangeHandler = value => {
        const testValue = /\S/.test(value);
        testValue && setSelectedIndex(value);
    };

    const isLoadingRelated = (key, name) => loadingRelated && loadingRelated.params.key == key && loadingRelated.params.name == name;

    return (
        <Template hiddenContextBar boxedCentered>
            <form style={{ marginTop: '.5em', marginBottom: '2em' }} onSubmit={(e) => { e.preventDefault(); performBrowse(selectedIndex); }}>
                <FlexWrapper>
                    <Select
                        value={selectedIndex}
                        placeholder={t('browse.form.select_placeholder')}
                        onChangeHandler={selectChangeHandler}
                        options={indexes()}
                    />
                    <PrimaryButton disabled={loadingBrowse || selectedIndex == ''} type="submit">{t(`browse.form.${loadingBrowse ? 'loading' : 'submit'}`)}</PrimaryButton>
                </FlexWrapper>
            </form>
            {
                loadingBrowse
                    ? <Loading />
                    : browseError
                        ? <div>{t('browse.results.error')}</div>
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
                                        loading={isLoadingRelated(key, e.name)}
                                        onClickHandler={collapsed => !collapsed && loadRelated({ index: selectedIndex, params: { key, name: e.name } })}>
                                        {
                                            related[`${key}_${e.name}`] && (!isLoadingRelated(key, e.name) && related[`${key}_${e.name}`] && Array.isArray(related[`${key}_${e.name}`])) && <div><ul>{
                                                related[`${key}_${e.name}`].map((data, index) => {
                                                    // console.log(data);

                                                    if (data.target) {
                                                        return (
                                                            <li key={index}>{data.label} <Link target="_blank" to={`/book#${data.target}`}>{t('browse.actions.go')}</Link></li>
                                                        );
                                                    }

                                                    return (
                                                        <li key={index}>
                                                            {data.name}
                                                            <ul>
                                                                {data.link.map((link, i) => <li key={i}>{link.label} <Link target="_blank" to={`/book#${link.target}`}>{t('browse.actions.go')}</Link></li>)}
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