import * as React from "react";

import { Links, LinkBooleanFieldModifierHandler } from "../types/types";

import ReadLinksView from "./ReadLinksView";
import FreshLinksView from "./FreshLinksView";
interface LinksViewProps {
  links: Links;
  linkIsFresh: LinkBooleanFieldModifierHandler;
  linkIsRead: LinkBooleanFieldModifierHandler;
}

const LinksView: React.FC<LinksViewProps> = ({
  links,
  linkIsRead,
  linkIsFresh,
}) => {
  const readLinks = links.filter(({ isRead }) => isRead);
  const freshLinks = links.filter(({ isRead }) => !isRead);
  return (
    <>
      <ReadLinksView
        links={readLinks}
        linkIsFresh={linkIsFresh}
      ></ReadLinksView>
      <FreshLinksView
        links={freshLinks}
        linkIsRead={linkIsRead}
      ></FreshLinksView>
    </>
  );
};

export default LinksView;
