'use client';

import AnimationPage from "@/app/AnimationPage";
import "./modal.scss";
import { IWithChildren } from "@/types/tehnic";
import { useRef } from "react";
import { useOnClickOutside } from 'usehooks-ts'


interface ModalProps extends IWithChildren {
  isOpened: boolean;
  onClose: () => void;
  clickOutside?: boolean;
}

const Modal = ({children, isOpened, onClose, clickOutside = true}: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null!);

  useOnClickOutside(ref, () => {
    if(clickOutside) onClose();
  })

  return (
    <AnimationPage isNoWait isModal conditions={isOpened} className="modal">
      <div ref={ref} className="modal__content">
        {children}
      </div>
    </AnimationPage>
  );
}

export default Modal;
