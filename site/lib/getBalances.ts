import { getJsonRpcProvider, getContract } from "@klimadao/lib/utils";
import { formatUnits } from "@klimadao/lib/utils";

type Params = {
  address: string;
};

export type Balances = {
  klima: string;
  sklima: string;
  bct: string;
  nct: string;
  mco2: string;
  nbo: string;
  ubo: string;
};

export const getBalances = async (params: Params): Promise<Balances> => {
  const provider = getJsonRpcProvider();

  const klimaContract = getContract({ contractName: "klima", provider });
  const sklimaContract = getContract({ contractName: "sklima", provider });
  const bctContract = getContract({ contractName: "bct", provider });
  const nctContract = getContract({ contractName: "nct", provider });
  const mco2Contract = getContract({ contractName: "mco2", provider });
  const nboContract = getContract({ contractName: "nbo", provider });
  const uboContract = getContract({ contractName: "ubo", provider });

  const klimaBalance = await klimaContract.balanceOf(params.address);
  const sklimaBalance = await sklimaContract.balanceOf(params.address);
  const bctBalance = await bctContract.balanceOf(params.address);
  const nctBalance = await nctContract.balanceOf(params.address);
  const mco2Balance = await mco2Contract.balanceOf(params.address);
  const nboBalance = await nboContract.balanceOf(params.address);
  const uboBalance = await uboContract.balanceOf(params.address);

  return {
    klima: formatUnits(klimaBalance, 9),
    sklima: formatUnits(sklimaBalance, 9),
    bct: formatUnits(bctBalance),
    nct: formatUnits(nctBalance),
    mco2: formatUnits(mco2Balance),
    nbo: formatUnits(nboBalance),
    ubo: formatUnits(uboBalance),
  };
};
