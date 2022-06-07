import * as React from "react";

import { Links, LinkBooleanFieldModifierHandler } from "../types/types";

import ReadLink from "./ReadLink";

interface ReadLinksViewProps {
  links: Links;
  linkIsFresh: LinkBooleanFieldModifierHandler;
}
const ReadLinksView: React.FC<ReadLinksViewProps> = ({
  links,
  linkIsFresh,
}) => {
  return (
    <>
      <div> Links I've Read </div>
      {links.map((link) => (
        <ReadLink key={link.id} link={link} linkIsFresh={linkIsFresh} />
      ))}
    </>
  );
};

export default ReadLinksView;
