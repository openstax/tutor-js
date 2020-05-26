import { styled } from 'vendor';
import { navbars } from '../theme.js';

const BackgroundWrapper = styled.div`
  background: #fff;
  min-height: calc(100vh - ${navbars.top.height} - ${navbars.bottom.height});
  position: relative;
  overflow: hidden;
  padding: 0 2.4rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export { BackgroundWrapper, ContentWrapper };
