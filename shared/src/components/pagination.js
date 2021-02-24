/* eslint-disable react/prop-types */
import React from 'react';
import cn from 'classnames';
import { createUltimatePagination, ITEM_TYPES } from 'react-ultimate-pagination';

// mostly taken from https://github.com/ultimate-pagination/react-ultimate-pagination-bootstrap-4/blob/master/src/react-ultimate-pagination-bootstrap-4.js#L40

const WrapperComponent = ({ children, className }) => (
    <ul className={cn('pagination', className)}>{children}</ul>
);

const withPreventDefault = (fn) => (event) => {
    event.preventDefault();
    fn();
};

const Page = ({ value, isActive, onClick }) => (
    <li className={isActive ? 'page-item active' : 'page-item'}>
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>{value}</a>
    </li>
);

const Ellipsis = ({ onClick }) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>...</a>
    </li>
);

const FirstPageLink = ({ onClick }) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>&laquo;</a>
    </li>
);

const PreviousPageLink = ({ onClick }) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>&lsaquo;</a>
    </li>
);

const NextPageLink = ({ onClick }) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>&rsaquo;</a>
    </li>
);

const LastPageLink = ({ onClick }) => (
    <li className="page-item">
        <a className="page-link" href="#" onClick={withPreventDefault(onClick)}>&raquo;</a>
    </li>
);

const itemTypeToComponent = {
    [ITEM_TYPES.PAGE]: Page,
    [ITEM_TYPES.ELLIPSIS]: Ellipsis,
    [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
    [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
    [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
    [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink,
};

const Pagination = createUltimatePagination({ itemTypeToComponent, WrapperComponent });

export default Pagination;
