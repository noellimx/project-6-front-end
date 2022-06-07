import * as React from "react";

import { Link, LinkBooleanFieldModifierHandler } from "../types/types";

import { Link as MLink } from "@mui/material";

interface ReadLinkProps {
  link: Link; // The model
  linkIsFresh: LinkBooleanFieldModifierHandler;
}

const ReadLink: React.FC<ReadLinkProps> = ({ link, linkIsFresh }) => {
  const { id, url } = link;
  const onClickUnReadFn = () => linkIsFresh(id);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div>{`${id}`}</div>
        <MLink href={`${url}`}>{`${url}`}</MLink>
        <a
          href={`${url}`}
          target="_blank"
          rel="noopener noreferrer"
        >{`${url}`}</a>
        <button onClick={onClickUnReadFn}>Mark As UnRead</button>
      </div>
    </>
  );
};

export default ReadLink;
