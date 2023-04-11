import React, { useMemo } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import placeholderImage from "../../../assets/images/kelly-sikkema-9OGNpJPVMZ8-unsplash.jpg";

import "./TextCard.scss";

const TextCard = ({ title, expressions }) => {
  const textBody = useMemo(() => generateTextBody(expressions), [expressions]);

  function generateTextBody(expressions) {
    if (!Array.isArray(expressions)) {
      console.log(expressions);
      return "";
    }

    const output = expressions
      .map((expression) => expression.words.map((word) => word.word).join(" "))
      .join(" ");

    console.log(output);

    return output;
  }

  return (
    // <>
    //   <h2>TEXT COMPONENT</h2>
    //   <div>{title}</div>
    //   <div>{textBody}</div>
    // </>
    <Card className="text-card" sx={{ maxWidth: "100%" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={placeholderImage}
          alt="placeholder"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {textBody}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TextCard;
