import React from "react";
import ReactDOM from "react-dom";
import classes from "./modal.module.css";

const modalRoot = document.getElementById("modal-root");

interface Props {
  children: React.ReactNode;
}
const Modal = ({ children }: Props) => {
  if (!modalRoot) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className={classes.overlay}>{children}</div>,
    modalRoot
  );
};

export default Modal;
