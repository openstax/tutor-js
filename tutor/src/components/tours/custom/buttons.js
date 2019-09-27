import { styled } from 'vendor';

const Primary = styled.button`
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #00c1de;
  transition: background-color 0.2s ease-in-out;
  :hover {
    background-color: #00dcfd;
  }
`;


const TextAction = styled.a`
  margin: 0;
  color: #002469;
  padding: 6px 12px;
  :first-child {
    margin-left: 0;
    padding-left: 0;
  }
`;

export { Primary, TextAction };
