import React, { useState } from "react";
import { ConnectModal } from ".";
import { useModal } from "../../providers";

export const useConnectModal = () => {
  const [open, setOpen] = useState(false);
  const { openModal, closeModal } = useModal();

  const toggleModal = () => {
    if (open) {
      closeModal();
      setOpen(false);
    } else {
      openModal(<ConnectModal />);
      setOpen(true);
    }
  };
  return toggleModal;
};
