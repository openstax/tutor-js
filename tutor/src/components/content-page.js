import { styled } from 'vendor';
import { breakpoint } from 'theme';

const ContentPage = styled.div`
  background: #fff;
  line-height: 2rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px 80px;
  ${breakpoint.tablet`
    padding: calc(${breakpoint.margins.mobile} * 2) ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    padding: ${breakpoint.margins.mobile};
  `}
  h3 {
    font-size: 1.4rem;
    font-weight: bold;
  }
  p, ul {
    margin-bottom: 2rem;
  }
`;

export default ContentPage;
