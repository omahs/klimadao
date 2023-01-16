import { ButtonPrimary, ConnectModal } from "@klimadao/lib/components";
import { useModal } from "@klimadao/lib/providers";
import { concatAddress, useWeb3 } from "@klimadao/lib/utils";
import React from "react";

type ConnectButtonProps = {
  buttonText: string;
  buttonClassName?: string;
  buttonVariant?: "lightGray" | "gray" | "blue" | "red" | "transparent" | null;
};

export const ConnectButton = (props: ConnectButtonProps) => {
  const { address, disconnect, isConnected } = useWeb3();
  const buttonVariant = props.buttonVariant ?? null;
  const { openModal } = useModal();
  return isConnected && address ? (
    <ButtonPrimary
      label={concatAddress(address)}
      onClick={disconnect}
      variant={buttonVariant}
      className={props.buttonClassName}
    />
  ) : (
    <ButtonPrimary
      label={props.buttonText}
      onClick={() => openModal(<ConnectModal />)}
      variant={buttonVariant}
      className={props.buttonClassName}
    />
  );
};
