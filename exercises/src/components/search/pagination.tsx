import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import BSPagination from 'shared/components/pagination';
import type Search from '../../models/search'

const PaginationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 2rem;
`;


export const Pagination: React.FC<{ search: Search }> = observer(({ search }) => {
    const { pagination } = search
    if (!pagination || search.isPending || pagination.totalPages <= 1) return null

    return (
        <PaginationWrapper>
            <BSPagination hideFirstAndLastPageLinks {...pagination} />
            <button onClick={() => search.fetchAll()}>Display all</button>
        </PaginationWrapper>
    )
})
