import * as React from "react";

import { Link, LinkBooleanFieldModifierHandler } from "../types/types";

import { Link as MLink } from "@mui/material";

interface FreshLinkProps {
  link: Link;
  linkIsRead: LinkBooleanFieldModifierHandler;
}

const FreshLink: React.FC<FreshLinkProps> = ({ link, linkIsRead }) => {
  const { id, url } = link;
  const onClickReadFn = () => linkIsRead(id);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>{`${id}`}</div>
        <a href={`${url}`} target="_blank" rel="noopener noreferrer">
          {`${url}`}
        </a>

        <button onClick={onClickReadFn}>Mark As Read</button>
      </div>
    </>
  );
};

export default FreshLink;
