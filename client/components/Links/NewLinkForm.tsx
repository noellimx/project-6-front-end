import * as React from "react";
import { LinkStringFieldModifierHandler } from "../types/types";

interface NewLinkFormProps {
  newUrlValue: string;
  newLinkFieldUpdated: LinkStringFieldModifierHandler;
  children?: JSX.Element;
}
const NewLinkForm: React.FC<NewLinkFormProps> = ({
  newUrlValue,
  newLinkFieldUpdated,
  children,
}) => {
  const onChangeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    newLinkFieldUpdated(e.target.value);
  };
  return (
    <>
      <input value={newUrlValue} onChange={onChangeFn}></input>
      {children}
    </>
  );
};

export default NewLinkForm;
