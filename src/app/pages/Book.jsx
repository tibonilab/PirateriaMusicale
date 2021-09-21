import React, { useEffect, useState, useContext } from 'react';

import HTMLfile from '../../../dataset/output.html';

import Template from '../components/template/Template.jsx';

import Diva from '../components/wrappers/Diva.jsx';

import { PrimaryButtonSmall } from '../components/template/components/Buttons.jsx';
import Select from '../components/form/Select.jsx';
import FlexWrapper from '../components/template/components/FlexWrapper.jsx';

import { useDidMount } from '../hooks/useDidMount';

import './Book.scss';

import AnalysisContext from '../context/analysisContext';


const anchorClickHandler = (id) => {
    const highlighted = document.getElementsByClassName('highlight');

    for (let item of highlighted) {
        item.classList.remove('highlight');
    }

    const element = document.getElementById(id);

    // const position = id.includes('d1e') ? 'center' : 'start';
    const position = 'center';

    if (element) {
        element.classList.add('highlight');
        element.scrollIntoView({
            behavior: 'auto',
            block: position,
            inline: position
        });

        document.getElementById('scroller').scrollLeft = 0;
    }

};


/**
 * Perform zoom over focused image
 * @param {Event} e 
 */
const performImgZoom = (e) => {

    e && e.preventDefault();

    const src = e.currentTarget.src;

    const zoommer = document.getElementById('zoommer');
    const zoommedImg = document.getElementById('zoommed-img');
    const figure = document.getElementById('zoom');

    zoommedImg.src = src;
    figure.style.backgroundImage = `url("${src}")`;

    zoommedImg.addEventListener('load', (e) => {

        const img = e.currentTarget;

        figure.style.width = img.width;
        figure.style.height = img.height;

        zoommer.style.display = 'flex';
    }, false);


    /**
     * the actual zoom on the figure
     * @param {Event} e 
     */
    const zoom = e => {
        let x;
        let y;
        let offsetX;
        let offsetY;

        var zoomer = e.currentTarget;
        e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX;
        e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX;
        x = offsetX / zoomer.offsetWidth * 100;
        y = offsetY / zoomer.offsetHeight * 100;
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
    };

    figure.addEventListener('mousemove', zoom, false);

    zoommer.addEventListener('click', () => { zoommer.style.display = 'none'; }, false);

};

/**
 * Check if image has "nozoom" class to enable zoom or not
 * @param {Element} DOMnode 
 * @returns {boolean}
 */
const hasZoom = DOMnode => {
    if (DOMnode.className && DOMnode.className.split(' ').indexOf('nozoom') >= 0) return false;
    if (DOMnode.parentNode) {
        return hasZoom(DOMnode.parentNode);
    }

    return true;
};

/**
 * Init event handlers on imported DOM
 */
const initEventHandlers = () => {
    // init image zoom
    const imgs = document.getElementsByClassName('inline');
    Array.from(imgs).forEach(img => hasZoom(img) && img.addEventListener('click', performImgZoom, false));

    // disable <a class="mergeformat">...</a> click
    const mergeformats = document.getElementsByClassName('mergeformat');
    Array.from(mergeformats).forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); }, false));

};

const parseHTML = () => HTMLfile.replaceAll('((REPLACE_WITH_MEDIA_ENDPOINT))', MEDIA_ENDPOINT);

const countPages = () => document.getElementsByClassName('pagebreak').length;

const TestHtml = () => {

    const { isContextBarVisible } = useContext(AnalysisContext);

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageURI, setCurrentPageURI] = useState('');
    const [currentHash, setCurrentHash] = useState();
    const [pageOptions, setPageOptions] = useState([]);
    const [isMobile, setIsMobile] = useState(window.outerWidth < 1440);
    const [leftSideSize, setLeftSideSize] = useState(window.outerWidth >= 1440 ? 60 : 100);
    const [divaVisible, setDivaVisible] = useState(0);//!isMobile);
    const [initialPageURI, setInitialPageURI] = useState();

    const onHashChange = () => {
        if (currentHash) {
            anchorClickHandler(currentHash);
        } else {
            window.scrollTop = 0;
        }
    };

    const setCurrentHashByWindowHash = () => {
        const anchor = window.location.hash.substring(1);
        setCurrentHash(anchor);

        if (anchor) {
            anchorClickHandler(anchor);

            const scroller = document.getElementById('scroller');

            const scrollTop = scroller.scrollTop;
            const boxHeight = scroller.offsetHeight;

            const pagebreaks = document.getElementsByClassName('pagebreak');

            let min = 9999999999;
            let page;

            for (let item of pagebreaks) {

                const offset = Math.abs(item.offsetTop - (scrollTop - boxHeight / 2));

                if (min >= offset) {
                    min = offset;
                    page = item;
                }
            }

            page && setInitialPageURI(`https://iiif.rism.digital/image/ch/CH_E_925_03/pyr_${page.id}.tif`);
        }

    };

    const didMount = useDidMount();

    const onScrollHtmlHandler = (e) => {
        if (e.target.id !== 'scroller') {
            return;
        }

        const scrollTop = e.target.scrollTop;

        if (scrollTop < 100) {
            setCurrentPage(0);
            return;
        }

        const boxHeight = e.target.offsetHeight;

        const pagebreaks = document.getElementsByClassName('pagebreak');

        let min = 9999999999;
        let page;
        let currentPage = 0;

        for (let item of pagebreaks) {

            const offset = Math.abs(item.offsetTop - (scrollTop - boxHeight / 2));

            if (min >= offset) {
                min = offset;
                page = item;

                currentPage++;
            }
        }

        console.log(page.id, currentPage);

        setCurrentPage(currentPage);
    };

    const updateLayout = () => {
        setIsMobile(window.outerWidth < 1440);

        if (window.outerWidth >= 1440) {
            setLeftSideSize(60);
        } else {
            setLeftSideSize(100);
        }
    };

    if (!didMount) {
        window.addEventListener('hashchange', setCurrentHashByWindowHash, false);
        window.addEventListener('resize', updateLayout, false);
    }

    useEffect(onHashChange, [currentHash]);

    useEffect(() => {
        if (!didMount) {
            setCurrentHashByWindowHash();
            generateSelectPageOptions(countPages());
            initEventHandlers();
        }
    }, [didMount]);

    const generateSelectPageOptions = (pageCount) => {
        const options = [];
        for (let k = 0; k <= pageCount; k++) {
            options.push({ value: k, label: k == 0 ? 'Cover' : k });
        }

        setPageOptions(options);
    };

    const navigateTo = page => {
        const pages = document.getElementsByClassName('pagebreak');

        if (pages[page - 1]) {
            anchorClickHandler(pages[page - 1].id);
            setCurrentPage(page);
        } else {
            anchorClickHandler('top');
            setCurrentPage(0);
        }
    };

    return (
        <Template>
            <div id="zoommer">
                <figure id="zoom">
                    <img id="zoommed-img" src="" />
                </figure>
            </div>

            <div style={{ display: 'flex', transition: 'max-width .25s ease-in-out', maxWidth: `calc(100% - ${isContextBarVisible ? '395px' : '75px'})`, width: '100%', position: 'fixed', height: 'calc(100vh - 73px)', margin: '-45px 0 -2em -75px' }}>

                <div
                    id="scroller"
                    onScroll={onScrollHtmlHandler}>
                    <div>
                        <div id="top" />

                        <div
                            id="scroller-content"
                            dangerouslySetInnerHTML={{ __html: parseHTML() }}
                        />
                    </div>
                </div>



                {/* <a href="#" style={{ position: 'fixed', bottom: '26px', right: '1em', zIndex: 1 }} onClick={e => { e && e.preventDefault(); setDivaVisible(!divaVisible); }}>
                        {divaVisible ? 'Hide Diva' : 'Show Diva'}
                    </a> */}

                {/* <FlexWrapper justifyContent="center" style={{ borderTop: '2px solid #e3e3e3', position: 'absolute', bottom: 0, height: '70px', padding: '10px 70px 10px 0', width: '100%', background: '#fff' }}>


                    <FlexWrapper style={{ width: '250px' }} className="nav">
                        <div style={{ marginTop: '-6px' }}>
                            <label>Navigation</label>
                            <FlexWrapper>

                                <PrimaryButtonSmall disabled={currentPage === 0} action={() => navigateTo(currentPage - 1 || 0)}>
                                    <span>&laquo;&nbsp;Prev</span>
                                </PrimaryButtonSmall>

                                <PrimaryButtonSmall style={{ marginLeft: '2px' }} disabled={currentPage === pageOptions.length - 1} action={() => navigateTo(currentPage + 1)}>
                                    <span>Next&nbsp;&raquo;</span>
                                </PrimaryButtonSmall>
                            </FlexWrapper>
                        </div>

                        <Select
                            label="Current page"
                            style={{ marginLeft: '1em', marginTop: '-6px' }}
                            inputStyle={{ padding: '.5rem' }}
                            options={pageOptions}
                            value={currentPage}
                            onChangeHandler={value => navigateTo(parseInt(value, 10))}
                        />

                    </FlexWrapper>
                </FlexWrapper> */}
            </div>

        </Template>
    );
};

export default TestHtml;