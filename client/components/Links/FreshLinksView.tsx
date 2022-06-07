import * as React from "react";

import { Links, LinkBooleanFieldModifierHandler } from "../types/types";

import FreshLink from "./FreshLink";

interface FreshLinksViewProps {
  links: Links;
  linkIsRead: LinkBooleanFieldModifierHandler;
}
const FreshLinksView: React.FC<FreshLinksViewProps> = ({
  links,
  linkIsRead,
}) => {
  return (
    <>
      <div> Links To Read </div>
      {links.map((link) => (
        <FreshLink key={link.id} link={link} linkIsRead={linkIsRead} />
      ))}
    </>
  );
};

export default FreshLinksView;
