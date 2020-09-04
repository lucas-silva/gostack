import { createGlobalStyle } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

import backgroundHeader from '../assets/images/backgroundHeader.svg';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #191920 url(${backgroundHeader}) no-repeat center top;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font-size: 14px;
    font-family: Roboto
  }

  #root {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px 50px;
  }

  button {
    cursor: pointer;
  }
`;
