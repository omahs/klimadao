import React, { createContext, FC } from "react";

import { useProvider } from "../../utils/useProvider";
import { web3InitialState, Web3ModalState } from "./types";

export const Web3Context = createContext<Web3ModalState>(web3InitialState);

interface Props {
  children: React.ReactNode;
}

/** Init the web3Modal and expose via react context  */
export const Web3ContextProvider: FC<Props> = (props) => {
  const providerState = useProvider();
  return (
    <Web3Context.Provider value={providerState}>
      {props.children}
    </Web3Context.Provider>
  );
};
