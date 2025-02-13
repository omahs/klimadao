import { urls } from "lib/constants";
import { NextApiHandler } from "next";

export interface APIDefaultResponse {
  message: string;
}

const verifyUser: NextApiHandler<
  { nonce: string } | APIDefaultResponse
> = async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        if (!req.body.wallet && !req.body.signature) {
          return res
            .status(400)
            .json({ message: "Bad request! Wallet or Signature is missing" });
        }

        const result = await fetch(`${urls.api.users}/login/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        });

        const json = await result.json();

        return res.status(200).json(json);
      } catch (error) {
        const { message } = error as Error;
        console.error("Request failed:", message);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default verifyUser;
