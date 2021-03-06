import { styled } from 'vendor';
import { colors } from 'theme';

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
  ${({ theme }) => theme.breakpoint.mobile`
    min-width: 100%;
  `}
`;

const DueCell = styled(Cell).withConfig({
    displayName: 'DueCell',
})`
  flex: 1;
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

const MobileRow = styled.div`
  padding: 1.5rem 1rem;
  width: inherit;
  color: ${colors.neutral.darker};
  
  i {
    padding: 1.3rem;
    margin-right: 0;
  }

  .assignment-title-icon {
    display: inline-flex;
    .assignment-title {
      font-weight: 600;
      font-size: 1.6rem;
      padding: 6px 0;
    }
  }

  .mobile-event-info-container {
    padding: 0 5px 0 40px;
    width: 100%;

    .mobile-event-info {
      display: flex;
      margin-top: 5px;
      flex-wrap: wrap;

      > span:first-child {
        flex: 0 1 20%;
        font-size: 1.2rem;
        color: ${props => props.theme.colors.neutral.std};
      }

      > span:last-child {
        flex: 0 1 80%;
        align-self: flex-end;
        font-size: 1.3rem;
        color: ${props => props.theme.colors.neutral.darker};

        .extension-icon {
          display: inline-block;
          margin-top: 0;
        }
        
        div {
          margin-top: 0;
        }
      }
    }
  }
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  color: ${({ theme }) => theme.colors.neutral.lightest};
  background: ${({ theme }) => theme.colors.neutral.lite};
`;

export { Row, MobileRow, TitleCell, DueCell, StatusCell, ScoreCell };
