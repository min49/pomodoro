import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    @import url('https://fonts.googleapis.com/css?family=Gugi|Patua+One');
    padding: 0;
    margin: 0;
  }
`;

const theme = {
  fgPrimary: "palevioletred",
  fgAccent: "mediumvioletred",
  //fgSecondary: "#853388",
  bgFirst: "floralwhite",
  bgSecond: "#f4e1f5"
};

export {GlobalStyle, theme};