import React from 'react';

import { Link } from 'react-router-dom';


import './LinkWithTooltip.scss';

const LinkWithTooltip = ({ to, children, content }) => (
    <Link className="linkWithTooltip" to={to}>
        <div className="linkWithTooltip-tooltip">{content}</div>
        {children}
    </Link>
);


export default LinkWithTooltip;