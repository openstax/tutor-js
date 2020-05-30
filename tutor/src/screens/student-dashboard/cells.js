import { styled } from 'vendor';

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TitleCell = styled(Cell).withConfig({
  displayName: 'TitleCell',
})`
  padding-left: 1rem;
  flex: 1;
  ${({ theme }) => theme.breakpoint.mobile`
    min-width: 100%;
  `}
`;

const DueCell = styled(Cell).withConfig({
  displayName: 'DueCell',
})`
  width: 15rem;
  ${({ theme }) => theme.breakpoint.mobile`
    padding-left: 1rem;
  `}
`;

const StatusCell = styled(Cell).withConfig({
  displayName: 'StatusCell',
})`
  width: 12rem;
  padding-right: 1rem;
  ${({ theme }) => theme.breakpoint.mobile`
     flex: 1;
  `}
`;

const ScoreCell = styled(Cell).withConfig({
  displayName: 'ScoreCell',
})`
  padding-right: 1rem;
  width: 10rem;
  ${({ theme }) => theme.breakpoint.mobile`
     flex: 1;
  `}
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  color: ${({ theme }) => theme.colors.neutral.lightest};
  background: ${({ theme }) => theme.colors.neutral.lite};
`;

export { Row, TitleCell, DueCell, StatusCell, ScoreCell };
