import { styled } from 'vendor';

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TitleCell = styled(Cell).withConfig({
  displayName: 'TitleCell',
})`
  padding: 0 6rem 0 1rem;
  flex: 1;
  i {
    flex-shrink: 0;
  }
  span {
    word-break: break-all;
  }
  ${({ theme }) => theme.breakpoint.mobile`
    min-width: 100%;
  `}
`;

const DueCell = styled(Cell).withConfig({
  displayName: 'DueCell',
})`
  width: 20rem;
  padding-right: 1rem;
  ${({ theme }) => theme.breakpoint.mobile`
    padding-left: 1.2rem;
  `}
`;

const StatusCell = styled(Cell).withConfig({
  displayName: 'StatusCell',
})`
  width: 15.5rem;
  padding-right: 1rem;
  ${({ theme }) => theme.breakpoint.mobile`
     flex: 1;
  `}
`;

const ScoreCell = styled(Cell).withConfig({
  displayName: 'ScoreCell',
})`
  padding-right: 1rem;
  width: 8rem;
  ${({ theme }) => theme.breakpoint.mobile`
     flex: 1;
  `}

  svg.fa-star {
    padding: 3px;
  }
`;

const MobileCell = styled.div`
  padding: 1.5rem 1rem;
  
  i {
    padding: 1.3rem;
  }

  span {
    font-weight: 600;
  }

  .mobile-event-info {
    padding-top: 10px;
  }
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  color: ${({ theme }) => theme.colors.neutral.lightest};
  background: ${({ theme }) => theme.colors.neutral.lite};
`;

export { Row, MobileCell, TitleCell, DueCell, StatusCell, ScoreCell };
