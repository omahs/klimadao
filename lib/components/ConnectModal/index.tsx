import {
  BraveIcon,
  ButtonPrimary,
  CoinbaseWalletIcon,
  DiscordColorIcon,
  FacebookColorIcon,
  GoogleIcon,
  MetaMaskFoxIcon,
  Spinner,
  Text,
  TwitterIcon,
  WalletConnectIcon,
} from "@klimadao/lib/components";
import { useModal } from "@klimadao/lib/providers";
import { useFocusTrap, useWeb3 } from "@klimadao/lib/utils";
import { Trans } from "@lingui/react";
import CloseDefault from "@mui/icons-material/Close";
import MailOutlineIconDefault from "@mui/icons-material/MailOutline";
import React, { useEffect, useState } from "react";
import { WEB3_MODAL_CONSTANTS } from "./constants";
import * as styles from "./styles";

type WalletType = "coinbase" | "torus" | "walletConnect" | "metamask" | "brave";

export const ConnectModal = (props: {
  step?: "connect" | "error" | "loading";
}) => {
  const [step, setStep] = useState<"connect" | "error" | "loading">("connect");
  const focusTrapRef = useFocusTrap();
  const { connect } = useWeb3();
  const [showMetamask, setShowMetamask] = useState(false);
  const [showBrave, setShowBrave] = useState(false);
  const { closeModal } = useModal();
  const title = WEB3_MODAL_CONSTANTS.titles[step];

  useEffect(() => {
    if (window.ethereum && (window.ethereum as any).isBraveWallet) {
      setShowBrave(true);
    } else if (window.ethereum) {
      setShowMetamask(true);
    }
  }, []);

  /** Connect to the appropriate wallet */
  const handleConnect = async (params: { wallet: WalletType }) => {
    try {
      if (!params.wallet) return;
      setStep("loading");
      await connect?.(params.wallet);
      closeModal();
    } catch (e) {
      console.error(e);
      setStep("error");
    }
  };

  return (
    <div aria-modal={true}>
      <div className={styles.modalBackground} onClick={closeModal} />
      <div className={styles.modalContainer}>
        <div className={styles.modalContent} ref={focusTrapRef}>
          <span className="title">
            <Text t="h4">{title}</Text>
            <button onClick={closeModal}>
              <CloseDefault fontSize="large" />
            </button>
          </span>
          {props.step === "connect" && (
            <>
              <div className={styles.buttonsContainer}>
                {showMetamask && (
                  <span
                    className={styles.walletButton}
                    onClick={() => handleConnect({ wallet: "metamask" })}
                  >
                    <MetaMaskFoxIcon />
                    <Text t="button">Metamask</Text>
                  </span>
                )}
                {showBrave && (
                  <span
                    className={styles.walletButton}
                    onClick={() => handleConnect({ wallet: "metamask" })}
                  >
                    <BraveIcon />
                    <Text t="button">Brave</Text>
                  </span>
                )}
                <span
                  className={styles.walletButton}
                  onClick={() => handleConnect({ wallet: "coinbase" })}
                >
                  <CoinbaseWalletIcon />
                  <Text t="button">Coinbase</Text>
                </span>
                <span
                  className={styles.walletButton}
                  onClick={() => handleConnect({ wallet: "walletConnect" })}
                >
                  <WalletConnectIcon />
                  <Text t="button">walletconnect</Text>
                </span>
              </div>
              <span className={styles.continueBox}>
                <div className={styles.leftLine} />
                <Text className={styles.continueText} t="badge">
                  <Trans id="connectModal.continue">or continue with</Trans>
                </Text>
                <div className={styles.rightLine} />
              </span>
              <div
                className={styles.torusButtons}
                onClick={() => handleConnect({ wallet: "torus" })}
              >
                <span className={styles.buttonBackground}>
                  <TwitterIcon className={styles.twitter} />
                </span>
                <span className={styles.buttonBackground}>
                  <FacebookColorIcon />
                </span>
                <span className={styles.buttonBackground}>
                  <GoogleIcon />
                </span>
                <span className={styles.buttonBackground}>
                  <DiscordColorIcon className={styles.discord} />
                </span>
                <span className={styles.buttonBackground}>
                  <MailOutlineIconDefault fontSize="large" />
                </span>
              </div>
            </>
          )}
          {props.step === "loading" && (
            <div className={styles.spinner}>
              <Spinner />
            </div>
          )}
          {props.step === "error" && (
            <div className={styles.errorContent}>
              <Text t="body2">
                <Trans id="connect_modal.error_message">
                  We had some trouble connecting. Please try again.
                </Trans>
              </Text>
              <ButtonPrimary label="OK" onClick={() => setStep("connect")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { useConnectModal } from "./useConnectModal";
