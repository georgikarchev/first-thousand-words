// import logo from './logo.svg';
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Badge from "@mui/material/Badge";
import { ThemeOptions } from "@mui/material/styles";

import TextCard from "./components/texts/text-card/TextCard";

import "./App.scss";
import { useEffect, useState } from "react";
import useScroll from "./hooks/useScroll";

const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#D36B00",
    },
    secondary: {
      main: "#f7e06a",
    },
    background: {
      default: "#F1EFDC",
      paper: "#E6D2AA",
    },
    text: {
      primary: "#D36B00",
      secondary: "#f7e06a",
      disabled: "rgba(197,137,64,0.2)",
      hint: "#ffa242",
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

  const appStateDefault = {
    dummyText: dummyExpressions,
    scrollProgress: 0,
    isTop: 0,
  };
  // ------ dev only code above
  const [appState, setAppState] = useState(appStateDefault);
  const scrollPosition = useScroll();

  useEffect(()=> {
    setAppState(state => ({...state, isTop: scrollPosition > 50}))
  },[scrollPosition]);

  function shrinkHeader() {
    window.scrollTo(0, 0);
    setAppState((state) => {
      return { ...state, isTop: false };
    });
  }

  function expandHeader() {
    setAppState((state) => {
      return { ...state, isTop: true };
    });
  }
  

  function MainMenu({ params }) {
    return (
      <nav>
        <ButtonGroup
          variant="text"
          size="large"
          aria-label="large primary button group"
        >
          <Badge badgeContent={4} color="secondary">
            <Button>One</Button>
          </Badge>
          <Badge badgeContent={4} color="secondary">
            <Button>Two</Button>
          </Badge>
          <Badge badgeContent={4} color="secondary">
            <Button>Three</Button>
          </Badge>
        </ButtonGroup>
      </nav>
    );
  }

  return (
    <div className={`App${appState.isTop ? " dashboard" : ""}`}>
      <header className="App-header">
        <h1>First thousand words</h1>
      </header>
      <main>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={4}
              className="stats"
              style={{ paddingLeft: "unset" }}
            >
              <Badge badgeContent={100} max={9999} color="secondary">
                <Button size="large">words</Button>
              </Badge>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className="stats"
              style={{ paddingLeft: "unset" }}
            >
              <Badge badgeContent={120} max={999} color="secondary">
                <Button size="large">expressions</Button>
              </Badge>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className="stats"
              style={{ paddingLeft: "unset" }}
            >
              <Badge badgeContent={20} max={99} color="secondary">
                <Button size="large">texts</Button>
              </Badge>
            </Grid>
            <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
              <Button variant="outlined" onClick={shrinkHeader}>
                New text
              </Button>
            </Grid>
            <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
              <Button variant="outlined" onClick={expandHeader}>
                New Dialogue
              </Button>
            </Grid>
          </Grid>
        </Box>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>
        <p>bla</p>

      </main>
    </div>
  );
}

export default App;
