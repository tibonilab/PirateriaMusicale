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
import customContext from '../context/customContext';

const highlightItem = (id, text) => {
    const highlighted = document.getElementsByClassName('highlight');

    for (let item of highlighted) {
        item.classList.remove('highlight');
    }

    const element = document.getElementById(id);

    if (element) {
        element.classList.add('highlight');

        if (/\S/.test(text)) {
            element.innerHTML = element.innerHTML.replace(new RegExp(`(${text})`, 'gi'), '<span style="background: yellow">$1</span>');
        }
    }

};


const anchorClickHandler = (id, highlightTerm) => {
    const element = document.getElementById(id);

    // const position = id.includes('d1e') ? 'center' : 'start';
    const position = 'start';

    highlightItem(id, highlightTerm);

    if (element) {
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

    const sourceImg = e.currentTarget;
    const sourceSrc = sourceImg.src;

    const zoommer = document.getElementById('zoommer');
    const zoommedImg = document.getElementById('zoommed-img');
    const figure = document.getElementById('zoom');

    const segments = sourceSrc.split('/');
    const filename = segments.pop();
    segments.push('fullsize');
    segments.push(filename);

    const fullsizesrc = segments.join('/');

    e.currentTarget.classList.add('loading');

    // setTimeout(() => {
    zoommedImg.src = fullsizesrc;
    figure.style.backgroundImage = `url("${fullsizesrc}")`;
    figure.style.opacity = 0;
    // }, 3000);

    zoommedImg.addEventListener('load', () => {

        sourceImg.classList.remove('loading');

        figure.style.width = zoommedImg.width;
        figure.style.height = zoommedImg.height;
        figure.style.opacity = 1;

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

const handleNotePopover = e => {
    e.preventDefault();

    const popovers = document.getElementsByClassName('notePopover');
    Array.from(popovers).forEach(e => e.remove());

    const href = e.currentTarget.href;
    const id = href.substring(href.indexOf('#') + 1);

    const noteBody = document.getElementById(id).querySelector('.noteBody');

    const wrapper = e.currentTarget.parentElement;

    wrapper.style = 'position: relative';

    const popover = document.createElement('div');
    popover.classList.add('notePopover');
    popover.innerHTML = noteBody.innerHTML;

    wrapper.appendChild(popover);

    popover.addEventListener('click', e => e.currentTarget.remove(), false);

    // console.log(id, noteBody.innerHTML);
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

    // init note popover on click
    const notelinks = document.getElementsByClassName('notelink');
    Array.from(notelinks).forEach(a => a.addEventListener('click', handleNotePopover, false));

};

const parseHTML = () => HTMLfile.replaceAll('((REPLACE_WITH_MEDIA_ENDPOINT))', MEDIA_ENDPOINT);

const parsedHTML = parseHTML();

const TestHtml = () => {

    const { isContextBarVisible, setActiveChapter } = useContext(AnalysisContext);

    const { highlightTerm, setHighlightTerm } = useContext(customContext);

    const [currentHash, setCurrentHash] = useState();
    const [isMobile, setIsMobile] = useState(window.outerWidth < 1440);
    const [leftSideSize, setLeftSideSize] = useState(window.outerWidth >= 1440 ? 60 : 100);
    const [initialPageURI, setInitialPageURI] = useState();

    const [content, setContent] = useState(false);

    const onHashChange = () => {
        if (currentHash) {
            anchorClickHandler(currentHash, highlightTerm);
        } else {
            window.scrollTop = 0;
        }
    };

    const setCurrentHashByWindowHash = () => {
        const anchor = window.location.hash.substring(1);
        setCurrentHash(anchor);

        if (anchor) {
            anchorClickHandler(anchor, highlightTerm);

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
            setActiveChapter(0);
            return;
        }


        const pagebreaks = document.getElementsByClassName('stdheader');

        let currentPage = 0;


        for (let item of pagebreaks) {

            if (item.offsetTop <= scrollTop) {
                currentPage++;
            }
        }

        setActiveChapter(currentPage);
    };

    const updateLayout = () => {
        setIsMobile(window.outerWidth < 1440);

        if (window.outerWidth >= 1440) {
            setLeftSideSize(60);
        } else {
            setLeftSideSize(100);
        }
    };

    const fetchHighlightTerm = () => {
        const highlightTerm = localStorage.getItem('temp-key');

        highlightTerm && (() => {
            localStorage.removeItem('temp-key');
            setHighlightTerm(highlightTerm);

            anchorClickHandler(window.location.hash.substring(1), highlightTerm);
        })();
    };

    if (!didMount) {
        window.addEventListener('hashchange', setCurrentHashByWindowHash, false);
        window.addEventListener('resize', updateLayout, false);
    }

    useEffect(onHashChange, [currentHash]);

    // useEffect(() => {
    //     if (!didMount) {
    //         setCurrentHashByWindowHash();
    //         initEventHandlers();
    //         fetchHighlightTerm();
    //     }
    // }, [didMount]);

    useEffect(() => {
        if (didMount && !content) {
            setContent(parsedHTML);

            setTimeout(() => {
                setCurrentHashByWindowHash();
                initEventHandlers();
                fetchHighlightTerm();
            }, 200);
        }
    });

    return (
        <Template>
            <div id="zoommer">
                <figure id="zoom">
                    <img id="zoommed-img" src="" />
                </figure>
            </div>

            <div style={{ display: 'flex', transition: 'max-width .25s ease-in-out', maxWidth: `calc(100% - ${isContextBarVisible && !isMobile ? '395px' : '75px'})`, width: '100%', position: 'fixed', height: 'calc(100vh - 73px)', margin: '-45px 0 -2em -75px' }}>

                <div
                    id="scroller"
                    onScroll={onScrollHtmlHandler}>
                    <div
                        id="scroller-content"
                        dangerouslySetInnerHTML={{ __html: content || '<div style="display:flex; height: 90vh; width: 100%; align-items: center; justify-content: center;">Caricamento in corso...</div>' }}
                    />
                </div>

            </div >

        </Template >
    );
};

export default TestHtml;