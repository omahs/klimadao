import { t, Trans } from "@lingui/macro";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { StaticImageData } from "next/legacy/image";
import { FC, useEffect, useState } from "react";

import { Holding } from "components/pages/Pledge/types";
import { Balances, BalanceToken, getBalances } from "lib/getBalances";
import BCTIcon from "public/icons/BCT.png";
import KLIMAIcon from "public/icons/KLIMA.png";
import MCO2Icon from "public/icons/MCO2.png";
import NBOIcon from "public/icons/NBO.png";
import NCTIcon from "public/icons/NCT.png";
import UBOIcon from "public/icons/UBO.png";

import { Text } from "@klimadao/lib/components";
import { BaseCard } from "../BaseCard";
import * as styles from "./styles";
import { TokenRow } from "./TokenRow";

type Props = {
  pageAddress: string;
  holdings: Holding[];
};

type TokenMap = {
  [key in BalanceToken]: {
    label: string;
    icon: StaticImageData;
  };
};

const TOKEN_MAP: TokenMap = {
  klima: {
    label: "KLIMA",
    icon: KLIMAIcon,
  },
  sklima: {
    label: "sKLIMA",
    icon: KLIMAIcon,
  },
  mco2: {
    label: "MCO2",
    icon: MCO2Icon,
  },
  bct: {
    label: "BCT",
    icon: BCTIcon,
  },
  nct: {
    label: "NCT",
    icon: NCTIcon,
  },
  nbo: {
    label: "NBO",
    icon: NBOIcon,
  },
  ubo: {
    label: "UBO",
    icon: UBOIcon,
  },
};

export const AssetBalanceCard: FC<Props> = (props) => {
  const [balances, setBalances] = useState<Balances | null>(null);
  console.log("holdings", props.holdings);
  // I think we should do all of this in pledge page
  const holdingsByToken = groupBy(props.holdings, "token");

  /** Hide tokens with no balance
   * @todo hide token with no transaction history*/
  const tokenHoldingAndBalances = map(TOKEN_MAP, (token, key) => ({
    ...token,
    balance: balances && balances[key as BalanceToken],
    holdings: holdingsByToken[token.label],
  })).filter(({ balance }) => !!Number(balance));

  useEffect(() => {
    (async () => {
      const balances = await getBalances({ address: props.pageAddress });
      setBalances(balances);
    })();
  }, []);

  return (
    <BaseCard
      title={t({
        id: "pledges.dashboard.assets.title",
        message: "Carbon Assets",
      })}
      icon={<CloudQueueIcon fontSize="large" />}
    >
      <div className={styles.tokenCardContainer}>
        {tokenHoldingAndBalances.map((token, index) => (
          <div className={styles.tokenRowContainer} key={index}>
            <TokenRow
              label={token.label}
              icon={token.icon}
              balance={token.balance}
              holdings={token.holdings}
            />

            {tokenHoldingAndBalances.length - 1 !== index && (
              <div className={styles.divider} />
            )}
          </div>
        ))}
        {tokenHoldingAndBalances.length === 0 && (
          <Text t="body2">
            <Trans id="pledges.dashboard.assets.emptyBalance">
              No carbon assets to show.
            </Trans>
          </Text>
        )}
      </div>
    </BaseCard>
  );
};
