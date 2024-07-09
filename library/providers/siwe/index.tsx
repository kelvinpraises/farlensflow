"use client";

import { Cacao, SiweMessage } from "@didtools/cacao";
import { randomBytes, randomString } from "@stablelib/random";
import { SIWEConfig, SIWEProvider as _SIWEProvider } from "connectkit";
import { DIDSession, createDIDCacao, createDIDKey } from "did-session";
import React from "react";
import { toast } from "sonner";

import { CustomSIWEConfig, SIWESession } from "@/types";

export const SESSION_KEY = "did";
let siweMessage: SiweMessage;
const keySeed = randomBytes(32);
const didKey = createDIDKey(keySeed);
let _chainId: number;

const siweConfig: CustomSIWEConfig = {
  getNonce: async () => {
    return randomString(10);
  },
  createMessage: async ({ address, chainId, nonce }) => {
    const now = new Date();
    const twentyFiveDaysLater = new Date(
      now.getTime() + 25 * 24 * 60 * 60 * 1000,
    );
    _chainId = chainId;

    siweMessage = new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: "Give this application access to some of your data on Ceramic",
      uri: (await didKey).id,
      version: "1",
      chainId: "1", // Ceramic won't work with any chainId other than 1
      nonce: nonce,
      issuedAt: now.toISOString(),
      expirationTime: twentyFiveDaysLater.toISOString(),
      resources: ["ceramic://*"],
    });

    return siweMessage.signMessage();
  },
  verifyMessage: async ({ message, signature }) => {
    console.log(message);
    try {
      siweMessage.signature = signature;

      const cacao = Cacao.fromSiweMessage(siweMessage);
      const did = await createDIDCacao(await didKey, cacao);
      const newSession = new DIDSession({ cacao, keySeed, did });

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          address: siweMessage.address,
          chainId: _chainId,
          did: newSession.serialize(),
        } as SIWESession),
      );

      toast.success("Successfully connected to your wallet.");

      return true;
    } catch (err) {
      console.error("Error during authentication process:", err);
      toast.error("Failed to connect to your wallet. Please try again.");
      return false;
    }
  },
  getSession: async () => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    try {
      const sessionObj = JSON.parse(sessionStr) as SIWESession;
      const session = await DIDSession.fromSession(sessionObj.did!);
      if (session.isExpired) return null;

      return sessionObj;
    } catch (err) {
      console.error("Error retrieving session:", err);
      return null;
    }
  },
  signOut: async () => {
    localStorage.removeItem(SESSION_KEY);
    return true;
  },
};

const SIWEProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <_SIWEProvider {...(siweConfig as SIWEConfig)}>{children}</_SIWEProvider>
  );
};

export default SIWEProvider;
