import { styled } from 'vendor';

const TruncatedText = styled.div`
  max-width: ${({ maxWidth }) => maxWidth || '1200px'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export { TruncatedText };
