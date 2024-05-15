// CardMain.jsx
import React from "react";
import {Card, CardBody} from "@nextui-org/react";

function CardMain({ text }) {
  return (
    <Card>
      <CardBody>
        
        <p style={{textAlign: "center", fontSize: "32px", fontWeight: "bold"}}>{text}</p>
      </CardBody>
    </Card>
  );
}

export default CardMain;