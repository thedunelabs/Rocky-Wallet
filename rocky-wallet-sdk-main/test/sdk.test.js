import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";

import {
  MINIMAL_CAPABLE_VERSION,
  ROCKY_ASSET_SYMBOLS,
  RockyWalletError,
  createRockyWalletClient,
  createRockyWalletSdk,
  resolveRockyAssetSymbol,
  rockyWallet,
  utils,
} from "../src/index.js";

const ACCOUNT = {
  partyId: "rockywallet-account2::1220c544dbaef462a812d91890fb804efac783fa386eab505a4e02d56dc8496eb353",
  displayName: "Account 2",
  networkId: "CANTON_NETWORK",
  fingerprint: "1220c544dbaef462a812d91890fb804efac783fa386eab505a4e02d56dc8496eb353",
  externalSigningKey: {
    algorithm: "ed25519",
    publicKey: "mock-public-key",
  },
};

const originalWindow = globalThis.window;

afterEach(() => {
  if (originalWindow === undefined) {
    Reflect.deleteProperty(globalThis, "window");
  } else {
    globalThis.window = originalWindow;
  }
});

test("publishes the synchronized 1.0.2 SDK and extension contract", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

  assert.equal(pkg.version, "1.0.2");
  assert.equal(MINIMAL_CAPABLE_VERSION, "1.0.2");
});

test("detects the Rocky Wallet extension provider", async () => {
  const provider = makeProvider();
  globalThis.window = makeWindow(provider);

  assert.deepEqual(await rockyWallet.checkExtensionAvailability(), {
    status: "installed",
    currentVersion: "1.0.2",
    minimalCapableVersion: "1.0.2",
    isExtensionCapableByVersion: true,
  });
  assert.equal(await rockyWallet.getWalletVersion(), "1.0.2");
});

test("does not expose direct signed-transfer submission API or types", () => {
  const declaration = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");

  assert.doesNotMatch(declaration, /submitSignedTransfer/);
  assert.doesNotMatch(declaration, /SubmitSignedTransfer/);
});

test("declares nullable catalog identities returned for unknown assets", () => {
  const declaration = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");

  assert.match(declaration, /asset_id: string \| null;/);
  assert.match(declaration, /asset_id\?: string \| null;/);
});

test("exposes CBTC as a supported Rocky asset and normalizes BTC instruments", () => {
  const declaration = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");

  assert.deepEqual(ROCKY_ASSET_SYMBOLS, ["CC", "USDCx", "CBTC"]);
  assert.equal(resolveRockyAssetSymbol("CBTC"), "CBTC");
  assert.equal(resolveRockyAssetSymbol("cBTC"), "CBTC");
  assert.equal(resolveRockyAssetSymbol("BTC"), "CBTC");
  assert.equal(resolveRockyAssetSymbol({ instrument_id: "cBTC-mainnet" }), "CBTC");
  assert.match(declaration, /export type RockyAssetSymbol = "CC" \| "USDCx" \| "CBTC"/);
});

test("waits for the extension initialization event before reporting availability", async () => {
  const win = makeWindow();
  globalThis.window = win;

  const availability = rockyWallet.checkExtensionAvailability({ timeoutMs: 50 });
  queueMicrotask(() => {
    win.rockyWallet = makeProvider({ version: "0.1.1" });
    win.dispatchEvent(new Event("rockyWallet#initialized"));
  });

  assert.equal((await availability).status, "installed");
  assert.equal((await rockyWallet.getWalletVersion()).currentVersion ?? (await rockyWallet.getWalletVersion()), "0.1.1");
});

test("returns notInstalled when no extension provider is injected", async () => {
  globalThis.window = makeWindow();

  assert.deepEqual(await rockyWallet.checkExtensionAvailability({ timeoutMs: 1 }), {
    status: "notInstalled",
    minimalCapableVersion: "1.0.2",
    isExtensionCapableByVersion: false,
  });
  await assert.rejects(() => rockyWallet.getPrimaryAccount({ timeoutMs: 1 }), RockyWalletError);
});

test("delegates account, balance, signing, transfer, and offer calls to the extension provider", async () => {
  const calls = [];
  const provider = makeProvider({ calls });
  const sdk = createRockyWalletSdk({ provider });

  assert.deepEqual(await sdk.connect({ name: "Rocky Exchange", target: "local" }), {
    isConnected: true,
    account: ACCOUNT,
  });
  assert.deepEqual(await sdk.getPrimaryAccount(), ACCOUNT);
  assert.deepEqual(await sdk.getActiveAccount(), ACCOUNT);
  assert.deepEqual(await sdk.getAccounts(), [ACCOUNT]);
  assert.deepEqual(await sdk.getActiveNetwork(), { id: "CANTON_NETWORK", name: "Canton Mainnet" });
  assert.deepEqual(await sdk.isConnected(), { isConnected: true, account: ACCOUNT });
  assert.equal((await sdk.status()).connection.isConnected, true);
  assert.deepEqual(await sdk.getCoinsBalance({ party: ACCOUNT.partyId }), {
    tokens: [{ symbol: "CC", amount: "8.54026" }],
  });
  assert.equal(
    await sdk.signMessage({
      message: { hex: "0x68656c6c6f" },
      metaData: { app: "Rocky Exchange", purpose: "authentication" },
    }),
    "rocky-wallet:signed",
  );
  assert.equal(await sdk.signLoginChallenge("login challenge", { app: "Rocky Exchange" }), "rocky-wallet:signed");
  assert.deepEqual(calls.at(-1).params, {
    message: { hex: "0x6c6f67696e206368616c6c656e6765" },
    metaData: { app: "Rocky Exchange", purpose: "authentication" },
  });
  assert.deepEqual(await sdk.submitCommands({ to: "Rocky::party", token: "CC", amount: "1" }), {
    status: true,
    transferId: "transfer-1",
  });
  assert.deepEqual(
    await sdk.buildTransfer({ fromParty: ACCOUNT.partyId, toAddress: "Rocky::party", assetSymbol: "CC", amount: "1" }),
    {
      unsigned_payload: "unsigned-payload",
      payload_hash: "payload-hash-1",
      resolved_to_party: "Rocky::party",
      asset_symbol: "CC",
      amount: "1",
    },
  );
  assert.deepEqual(await sdk.sendTransfer({ to: "Rocky::party", token: "CC", amount: "1" }), {
    status: true,
    transferId: "transfer-1",
  });
  assert.deepEqual(await sdk.transfer("Rocky::party", "2", "CC", { memo: "test" }), {
    status: true,
    transferId: "transfer-1",
  });
  assert.deepEqual(await sdk.getNodeOffers({ party: ACCOUNT.partyId }), { items: [{ id: "offer-1" }] });
  assert.deepEqual(await sdk.submitInstructionChoice({ transferCid: "offer-1", choice: "Accept" }), { status: true });

  assert.deepEqual(
    calls.map((call) => call.method),
    [
      "connect",
      "getPrimaryAccount",
      "getPrimaryAccount",
      "getPrimaryAccount",
      "getActiveNetwork",
      "getPrimaryAccount",
      "getActiveNetwork",
      "getPrimaryAccount",
      "getCoinsBalance",
      "signMessage",
      "signMessage",
      "submitCommands",
      "buildTransfer",
      "sendTransfer",
      "transfer",
      "getNodeOffers",
      "submitInstructionChoice",
    ],
  );
});

test("rejects wallet secret fields before provider calls", async () => {
  const calls = [];
  const sdk = createRockyWalletSdk({ provider: makeProvider({ calls }) });

  await assert.rejects(
    () =>
      sdk.sendTransfer({
        to: "Rocky::party",
        token: "CC",
        amount: "1",
        wallet_password: "must-stay-local",
      }),
    (error) =>
      error instanceof RockyWalletError &&
      error.code === -32602 &&
      /wallet_password/.test(error.message),
  );
  await assert.rejects(
    () =>
      sdk.signMessage({
        message: "hello",
        metadata: {
          privateKey: "must-stay-local",
        },
      }),
    (error) =>
      error instanceof RockyWalletError &&
      error.code === -32602 &&
      /privateKey/.test(error.message),
  );

  assert.deepEqual(calls, []);
});

test("builds Console-compatible login challenge signatures", async () => {
  const calls = [];
  const sdk = createRockyWalletSdk({ provider: makeProvider({ calls }) });

  await assert.rejects(
    () => sdk.signLoginChallenge("  "),
    (error) =>
      error instanceof RockyWalletError &&
      error.code === -32602 &&
      /login challenge/.test(error.message),
  );

  assert.equal(
    await sdk.signLoginChallenge("Rocky Exchange login", {
      app: "Rocky Exchange",
      metaData: { nonce: "nonce-1" },
    }),
    "rocky-wallet:signed",
  );
  assert.deepEqual(calls, [
    {
      method: "signMessage",
      params: {
        message: { hex: "0x526f636b792045786368616e6765206c6f67696e" },
        metaData: {
          app: "Rocky Exchange",
          purpose: "authentication",
          nonce: "nonce-1",
        },
      },
    },
  ]);
});

test("rejects wallet secret fields in timeout-style options before provider calls", async () => {
  const calls = [];
  const sdk = createRockyWalletSdk({ provider: makeProvider({ calls }) });

  const methods = [
    () => sdk.getPrimaryAccount({ mnemonic: "must-stay-local" }),
    () => sdk.getActiveAccount({ seed: "must-stay-local" }),
    () => sdk.getAccounts({ recovery_phrase: "must-stay-local" }),
    () => sdk.getActiveNetwork({ walletPassword: "must-stay-local" }),
    () => sdk.getWalletVersion({ decrypted_vault: "must-stay-local" }),
    () => sdk.disconnect({ private_key: "must-stay-local" }),
    () => sdk.isConnected({ privateKey: "must-stay-local" }),
    () => sdk.status({ wallet_password: "must-stay-local" }),
  ];

  for (const call of methods) {
    await assert.rejects(
      call,
      (error) =>
        error instanceof RockyWalletError &&
        error.code === -32602 &&
        /wallet secret field/.test(error.message),
    );
  }

  assert.deepEqual(calls, []);
});

test("rejects wallet secret field name variants via substring matching", async () => {
  const calls = [];
  const sdk = createRockyWalletSdk({ provider: makeProvider({ calls }) });

  const methods = [
    () => sdk.getPrimaryAccount({ seedPhrase: "must-stay-local" }),
    () => sdk.getActiveAccount({ privateKeyHex: "must-stay-local" }),
    () => sdk.getAccounts({ backupPhrase: "must-stay-local" }),
    () => sdk.getActiveNetwork({ walletSeed: "must-stay-local" }),
    () => sdk.getWalletVersion({ xprv: "must-stay-local" }),
    () => sdk.disconnect({ keystoreJson: "must-stay-local" }),
    () => sdk.isConnected({ secretKey: "must-stay-local" }),
    () => sdk.status({ passphrase: "must-stay-local" }),
    () => sdk.status({ wif: "must-stay-local" }),
  ];

  for (const call of methods) {
    await assert.rejects(
      call,
      (error) =>
        error instanceof RockyWalletError &&
        error.code === -32602 &&
        /wallet secret field/.test(error.message),
    );
  }

  assert.deepEqual(calls, []);
});

test("utilities match the Console SDK parser helpers", () => {
  const bytes = new Uint8Array([104, 101, 108, 108, 111]);

  assert.equal(utils.toHex(bytes), "0x68656c6c6f");
  assert.deepEqual(utils.hexToBytes("0x68656c6c6f"), bytes);
  assert.equal(utils.toBase64(bytes), "aGVsbG8=");
  assert.deepEqual(utils.base64ToBytes("aGVsbG8="), bytes);
  assert.equal(utils.hexToBase64("0x68656c6c6f"), "aGVsbG8=");
  assert.equal(utils.base64ToHex("aGVsbG8="), "0x68656c6c6f");
  assert.equal(utils.equalBytes(bytes, new Uint8Array([104, 101, 108, 108, 111])), true);
  assert.equal(utils.equalBytes(bytes, new Uint8Array([104])), false);
});

test("supports Loop-style init and connect lifecycle", async () => {
  const accepted = [];
  const provider = makeProvider();
  const client = createRockyWalletClient({ provider });

  client.init({
    appName: "Rocky Exchange",
    onAccept: (connectedProvider) => accepted.push(connectedProvider),
  });

  const connect = await client.connect();

  assert.equal(connect.isConnected, true);
  assert.equal(client.provider, provider);
  assert.equal(accepted[0], provider);
  assert.deepEqual(await client.wallet.transfer("Rocky::party", 3, "CC", { memo: "loop-style" }), {
    status: true,
    transferId: "transfer-1",
  });
});

test("Loop-style wallet.transfer uses sendTransfer when provider has no native transfer shortcut", async () => {
  const calls = [];
  const provider = makeProvider({ calls });
  delete provider.transfer;
  const client = createRockyWalletClient({ provider });

  client.init({ appName: "Rocky Exchange" });
  await client.connect();

  assert.deepEqual(await client.wallet.transfer("Rocky::party", 3, "CC", { memo: "loop-style" }), {
    status: true,
    transferId: "transfer-1",
  });
  assert.equal(calls.at(-1).method, "sendTransfer");
  assert.deepEqual(calls.at(-1).params, {
    to: "Rocky::party",
    amount: "3",
    token: "CC",
    memo: "loop-style",
    options: { memo: "loop-style" },
  });
});

test("normalizes cBTC instruments for native and fallback transfer providers", async () => {
  const nativeCalls = [];
  const nativeSdk = createRockyWalletSdk({ provider: makeProvider({ calls: nativeCalls }) });

  await nativeSdk.transfer("Cantex::party", "0.0001", { instrument_id: "cBTC-mainnet" });
  assert.deepEqual(nativeCalls.at(-1), {
    method: "transfer",
    params: {
      to: "Cantex::party",
      amount: "0.0001",
      instrument: "CBTC",
      options: {},
    },
  });

  const fallbackCalls = [];
  const fallbackProvider = makeProvider({ calls: fallbackCalls });
  delete fallbackProvider.transfer;
  const fallbackClient = createRockyWalletClient({ provider: fallbackProvider });
  fallbackClient.init({ appName: "Rocky Exchange" });
  await fallbackClient.connect();

  await fallbackClient.wallet.transfer("Cantex::party", "0.0001", "cBTC");
  assert.deepEqual(fallbackCalls.at(-1), {
    method: "sendTransfer",
    params: {
      to: "Cantex::party",
      amount: "0.0001",
      token: "CBTC",
      memo: "",
      options: {},
    },
  });
});

test("reads the configured asset catalog from a capable extension", async () => {
  const calls = [];
  const catalog = [{
    asset_id: "cusd-mainnet",
    asset_type: "token_standard",
    symbol: "instrument-id-cusd",
    name: "CUSD",
    display_alias: "CUSD",
    registry_name: "Canton USD",
    decimals: 10,
    logo_mode: "upload",
    logo_url: "https://api-extension.rocky.exchange/v1/assets/cusd-mainnet/logo",
    enabled: true,
    configured: true,
    can_receive: true,
    can_send: true,
    can_auto_accept: true,
    auto_accept_default: false,
    price_mode: "none",
    fixed_price_usd: null,
    ticker_pair: null,
    registry_verified_at: "2026-07-17T00:00:00.000Z",
    sort_order: 40,
  }];
  const provider = makeProvider({ calls });
  provider.getAssetCatalog = async () => {
    calls.push({ method: "getAssetCatalog" });
    return catalog;
  };

  const sdk = createRockyWalletSdk({ provider });

  assert.deepEqual(await sdk.getAssetCatalog(), catalog);
  assert.deepEqual(calls, [{ method: "getAssetCatalog" }]);
});

test("sends a configured asset by canonical asset id without forwarding registry identity", async () => {
  const calls = [];
  const provider = makeProvider({ calls, version: "1.0.1" });
  provider.getAssetCatalog = async () => [];
  const sdk = createRockyWalletSdk({ provider });

  await sdk.transfer({
    asset_id: "cusd-mainnet",
    symbol: "CUSD",
    to: "Cantex::party",
    amount: "0.1",
    memo: "invoice-1",
    instrument_admin: "must-not-be-forwarded",
    instrument_id: "must-not-be-forwarded",
  });

  assert.deepEqual(calls, [{
    method: "sendTransfer",
    params: {
      asset_id: "cusd-mainnet",
      symbol: "CUSD",
      to: "Cantex::party",
      amount: "0.1",
      memo: "invoice-1",
    },
  }]);
});

test("keeps legacy positional transfers compatible with extension 1.0.0", async () => {
  const calls = [];
  const provider = makeProvider({ calls, version: "1.0.0" });
  delete provider.getAssetCatalog;
  const sdk = createRockyWalletSdk({ provider });

  await sdk.transfer("Rocky::party", "2", "USDCx");

  assert.deepEqual(calls, [{
    method: "transfer",
    params: {
      to: "Rocky::party",
      amount: "2",
      instrument: "USDCx",
      options: {},
    },
  }]);
  await assert.rejects(
    () => sdk.getAssetCatalog(),
    (error) => error instanceof RockyWalletError && error.code === 4200,
  );
});

test("blocks asset-id transfers when the extension lacks dynamic asset support", async () => {
  const calls = [];
  const provider = makeProvider({ calls, version: "1.0.0" });
  delete provider.getAssetCatalog;
  const sdk = createRockyWalletSdk({ provider });

  await assert.rejects(
    () => sdk.transfer({ asset_id: "cusd-mainnet", symbol: "CUSD", to: "Cantex::party", amount: "0.1" }),
    (error) => error instanceof RockyWalletError && error.code === 4200 && /dynamic assets/.test(error.message),
  );
  assert.deepEqual(calls, []);
});

test("rejects unknown legacy asset symbols instead of aliasing them to CC", async () => {
  const calls = [];
  const sdk = createRockyWalletSdk({ provider: makeProvider({ calls }) });

  await assert.rejects(
    () => sdk.transfer("Cantex::party", "0.1", "CUSD"),
    (error) => error instanceof RockyWalletError && /Unsupported asset symbol: CUSD/.test(error.message),
  );
  assert.deepEqual(calls, []);
});

test("does not import WebCrypto keys in the dApp SDK", () => {
  const source = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /subtle\s*\.\s*importKey|SubtleCrypto|crypto\s*\.\s*subtle/i);
});

test("declares generic asset catalog and transfer APIs", () => {
  const declaration = readFileSync(new URL("../src/index.d.ts", import.meta.url), "utf8");

  assert.match(declaration, /export interface RockyAssetIdentity/);
  assert.match(declaration, /export interface RockyAssetDescriptor extends RockyAssetIdentity/);
  assert.match(declaration, /asset_id\?: string/);
  assert.match(declaration, /getAssetCatalog\([^)]*\): Promise<RockyAssetDescriptor\[\]>/);
  assert.match(declaration, /transfer\(request: RockyAssetTransferRequest\)/);
  assert.match(declaration, /instrument_admin\?: string \| null;/);
  assert.match(declaration, /instrument_id\?: string \| null;/);
  assert.match(declaration, /display_alias: string \| null;/);
  assert.match(declaration, /registry_name: string \| null;/);
  assert.match(declaration, /decimals: number \| null;/);
  assert.match(declaration, /logo_mode\?: string;/);
  assert.match(declaration, /logo_url\?: string \| null;/);
  assert.match(declaration, /fixed_price_usd\?: string \| null;/);
  assert.match(declaration, /ticker_pair\?: string \| null;/);
  assert.match(declaration, /registry_verified_at\?: string \| null;/);
  assert.match(declaration, /priceUsd\?: string \| null;/);
  assert.match(declaration, /price_usd\?: string \| null;/);
  assert.match(declaration, /usd_price\?: string \| null;/);
  assert.match(declaration, /usd_value\?: string \| null;/);
});

test("wallet facade rejects with a stable SDK error before connection", async () => {
  const client = createRockyWalletClient({ provider: makeProvider() });
  client.init({ appName: "Rocky Exchange" });

  await assert.rejects(
    () => client.wallet.transfer("Rocky::party", "1", "CC"),
    (error) =>
      error instanceof RockyWalletError &&
      error.code === 4900 &&
      /SDK not connected/.test(error.message),
  );
});

test("normalizes provider request failures into RockyWalletError", async () => {
  const provider = makeProvider();
  provider.signMessage = async () => {
    const error = new Error("Signature request rejected");
    error.code = "USER_REJECTED";
    throw error;
  };
  const sdk = createRockyWalletSdk({ provider });

  await assert.rejects(
    () => sdk.signMessage({ message: { hex: "0x68656c6c6f" } }),
    (error) =>
      error instanceof RockyWalletError &&
      error.code === 4001 &&
      error.message === "Signature request rejected" &&
      error.data?.causeCode === "USER_REJECTED",
  );
});

function makeWindow(provider) {
  const win = new EventTarget();
  win.location = { origin: "https://demo.rocky.exchange" };
  if (provider) win.rockyWallet = provider;
  return win;
}

function makeProvider({ calls = [], version = "1.0.2" } = {}) {
  return {
    isRockyWallet: true,
    version,
    async connect(options) {
      calls.push({ method: "connect", params: options });
      return { isConnected: true, account: ACCOUNT };
    },
    async disconnect() {
      calls.push({ method: "disconnect" });
      return { status: true };
    },
    async getPrimaryAccount() {
      calls.push({ method: "getPrimaryAccount" });
      return ACCOUNT;
    },
    async getActiveNetwork() {
      calls.push({ method: "getActiveNetwork" });
      return { id: "CANTON_NETWORK", name: "Canton Mainnet" };
    },
    async getCoinsBalance(params) {
      calls.push({ method: "getCoinsBalance", params });
      return { tokens: [{ symbol: "CC", amount: "8.54026" }] };
    },
    async signMessage(input) {
      calls.push({ method: "signMessage", params: input });
      return "rocky-wallet:signed";
    },
    async submitCommands(input) {
      calls.push({ method: "submitCommands", params: input });
      return { status: true, transferId: "transfer-1" };
    },
    async buildTransfer(input) {
      calls.push({ method: "buildTransfer", params: input });
      return {
        unsigned_payload: "unsigned-payload",
        payload_hash: "payload-hash-1",
        resolved_to_party: input.toAddress,
        asset_symbol: input.assetSymbol,
        amount: input.amount,
      };
    },
    async sendTransfer(input) {
      calls.push({ method: "sendTransfer", params: input });
      return { status: true, transferId: "transfer-1" };
    },
    async transfer(to, amount, instrument, options) {
      calls.push({ method: "transfer", params: { to, amount, instrument, options } });
      return { status: true, transferId: "transfer-1" };
    },
    async getNodeOffers(input) {
      calls.push({ method: "getNodeOffers", params: input });
      return { items: [{ id: "offer-1" }] };
    },
    async submitInstructionChoice(input) {
      calls.push({ method: "submitInstructionChoice", params: input });
      return { status: true };
    },
  };
}
