// import logo from './logo.svg';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { ThemeOptions } from '@mui/material/styles';

import TextCard from "./components/texts/text-card/TextCard";

import "./App.scss";


const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#D36B00',
    },
    secondary: {
      main: '#f7e06a',
    },
    background: {
      default: '#F1EFDC',
      paper: '#E6D2AA',
    },
    text: {
      primary: '#D36B00',
      secondary: '#f7e06a',
      disabled: 'rgba(197,137,64,0.2)',
      hint: '#ffa242',
    },
  },
};

function App() {
  const dummyExpressions = [
    {
      _id: "643004f64ce9fda6ed11bef1",
      type: "imperative",
      language: "english",
      words: [
        {
          _id: "643004f64ce9fda6ed11bee2",
          word: "running",
          language: "english",
          type: "noun",
          isPlural: true,
          published: false,
          created: "2023-04-07T11:56:38.058Z",
          __v: 0,
          description: "updated test description",
          modified: "2023-04-07T11:56:38.082Z",
          notes: "updated test notes",
        },
        {
          _id: "643004f64ce9fda6ed11bee4",
          word: "run",
          language: "english",
          type: "verb",
          isPlural: false,
          published: true,
          description: "test description",
          notes: "test notes",
          created: "2023-04-07T11:56:38.065Z",
          __v: 0,
        },
      ],
      published: false,
      created: "2023-04-07T11:56:38.089Z",
      __v: 1,
      description: "updated test description",
      modified: "2023-04-07T11:56:38.114Z",
      notes: "updated test notes",
    },
    {
      _id: "643004f64ce9fda6ed11bef4",
      type: "declarative",
      language: "english",
      words: [
        {
          _id: "643004f64ce9fda6ed11bee4",
          word: "run",
          language: "english",
          type: "verb",
          isPlural: false,
          published: true,
          description: "test description",
          notes: "test notes",
          created: "2023-04-07T11:56:38.065Z",
          __v: 0,
        },
      ],
      published: false,
      created: "2023-04-07T11:56:38.093Z",
      __v: 0,
    },
  ];

  const appState = {
    dummyText: dummyExpressions,
  };

  const testExpressions = Array("one", "two", "three");
  const testString = "My String";

  return (
    <div className="App">
      <header className="App-header">
        <h1>First thousand words</h1>
      </header>
      <main>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} className="stats" style={{paddingLeft: "unset"}}>
              1000 <span>words</span>
            </Grid>
            <Grid item xs={12} md={4} className="stats" style={{paddingLeft: "unset"}}>
              120 <span>expressions</span>
            </Grid>
            <Grid item xs={12} md={4} className="stats" style={{paddingLeft: "unset"}}>
              20 <span>texts</span>
            </Grid>
            <Grid item xs={12} md={6} style={{textAlign: "center"}}>
              <Button variant="outlined">New text</Button>
            </Grid>
            <Grid item xs={12} md={6} style={{textAlign: "center"}}>
              <Button variant="outlined">New Dialogue</Button>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div>
  );
}

export default App;
