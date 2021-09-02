/**
 * Elliptic curve used for wallet key operations.
 */
export enum EllipticCurve {
  Secp256k1 = 'secp256k1',
  Ed25519 = 'ed25519',
  Secp256r1 = 'secp256r1',
}

export enum SigningMethod {
  SignHash = 'SignHash',
  SignRaw = 'SignRaw',
  SignHashSignedByIssuer = 'SignHashSignedByIssuer',
  SignRawSignedByIssuer = 'SignRawSignedByIssuer',
  SignHashSignedByIssuerAndUpdateIssuerData = 'SignHashSignedByIssuerAndUpdateIssuerData',
  SignRawSignedByIssuerAndUpdateIssuerData = 'SignRawSignedByIssuerAndUpdateIssuerData',
  SignPos = 'SignPos',
}

export enum EncryptionMode {
  None = 'none',
  Fast = 'fast',
  Strong = 'strong',
}

export enum FirmwareType {
  Sdk = 'd SDK',
  Release = 'r',
  Special = 'special',
}

export enum FileSettings {
  Private,
  Public,
}

export enum FileValidation {
  NotValidated = 'notValidated',
  Valid = 'valid',
  Corrupted = 'corrupted',
}

export enum Status {
  Failed = 'failed',
  Warning = 'warning',
  Skipped = 'skipped',
  VerifiedOffline = 'verifiedOffline',
  Verified = 'verified',
}

export enum LinkedTerminalStatus {
  /**
   * Current app instance is linked to the card
   */
  Current = 'current',
  /**
   * The other app/device is linked to the card
   */
  Other = 'other',
  /**
   * No app/device is linked
   */
  None = 'none',
}

type Data = string;

type DerivationPath = string;

/**
 * Holds information about card firmware version included version saved on card `version`,
 *  splitted to `major`, `minor` and `hotFix` and `FirmwareType`
 */
export interface FirmwareVersion {
  hotFix: number;
  major: number;
  minor: number;
  type: FirmwareType;
  version: string;
}

export interface WalletSettings {
  /**
   * if true, erasing the wallet will be prohibited
   */
  isPermanent: Boolean;
}

export interface Wallet {
  /**
   * Public key of the blockchain wallet.
   */
  publicKey: Data;
  /**
   * Optional chain code for BIP32 derivation.
   */
  chainCode?: Data;
  /**
   * Elliptic curve used for all wallet key operations.
   */
  curve: EllipticCurve;
  /**
   * Wallet's settings
   */
  settings: WalletSettings;
  /**
   * Total number of signed hashes returned by the wallet since its creation
   */
  totalSignedHashes?: Number;
  /**
   * Remaining number of `Sign` operations before the wallet will stop signing any data.
   * - Note: This counter were deprecated for cards with COS 4.0 and higher
   */
  remainingSignatures?: Number;
  /**
   * Index of the wallet in the card storage
   */
  index: Number;
}

export interface Manufacturer {
  /**
   * Card manufacturer name.
   */
  name: string;
  /**
   * Timestamp of manufacturing.
   */
  manufactureDate: Date;
  /**
   * Signature of CardId with manufacturer’s private key. COS 1.21+
   */
  signature?: Data;
}

export interface Issuer {
  /**
   * Name of the issuer.
   */
  name: String;
  /**
   * Public key that is used by the card issuer to sign IssuerData field.
   */
  publicKey: Data;
}

export interface Settings {
  /**
   * Delay in milliseconds before executing a command that affects any sensitive data or wallets on the card
   */
  securityDelay: number;
  /**
   * Maximum number of wallets that can be created for this card
   */
  maxWalletsCount: number;
  /**
   * Is allowed to change access code
   */
  isSettingAccessCodeAllowed: boolean;
  /**
   * Is  allowed to change passcode
   */
  isSettingPasscodeAllowed: boolean;
  /**
   * Is allowed to remove access code
   */
  isRemovingAccessCodeAllowed: boolean;
  /**
   * Is LinkedTerminal feature enabled
   */
  isLinkedTerminalEnabled: boolean;
  /**
   * All  encryption modes supported by the card
   */
  supportedEncryptionModes: [EncryptionMode];
  /**
   * Is allowed to delete wallet. COS before v4
   */
  isPermanentWallet: boolean;
  /**
   * Is overwriting issuer extra data restricted
   */
  isOverwritingIssuerExtraDataRestricted: boolean;
  /**
   * Card's default signing methods according personalization.
   */
  defaultSigningMethods?: SigningMethod;
  /**
   * Card's default curve according personalization.
   */
  defaultCurve?: EllipticCurve;
  /**
   *
   */
  isIssuerDataProtectedAgainstReplay: boolean;
  /**
   *
   */
  isSelectBlockchainAllowed: boolean;
}

export interface Attestation {
  /**
   * Attestation status of card's public key
   */
  cardKeyAttestation: Status;
  /**
   * Attestation status of all wallet public key in the card
   */
  walletKeysAttestation: Status;
  /**
   * Attestation status of card's firmware. Not implemented for this time
   */
  firmwareAttestation: Status;
  /**
   * Attestation status of card's uniqueness. Not implemented for this time
   */
  cardUniquenessAttestation: Status;
}

export interface Card {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
  /**
   * Tangem internal manufacturing batch ID.
   */
  batchId: string;
  /**
   * Public key that is used to authenticate the card against manufacturer’s database.
   * It is generated one time during card manufacturing.
   */
  cardPublicKey: Data;
  /**
   * Version of Tangem COS.
   */
  firmwareVersion: FirmwareVersion;
  /**
   * Information about manufacturer
   */
  manufacturer: Manufacturer;
  /**
   * Information about issuer
   */
  issuer: Issuer;
  /**
   * Card setting, that were set during the personalization process
   */
  settings: Settings;
  /**
   * When this value is `current`, it means that the application is linked to the card,
   * and COS will not enforce security delay if `SignCommand` will be called
   * with `TlvTag.TerminalTransactionSignature` parameter containing a correct signature of raw data
   * to be signed made with `TlvTag.TerminalPublicKey`.
   */
  linkedTerminalStatus: LinkedTerminalStatus;
  /**
   * PIN2 (aka Passcode) is set.
   * Available only for cards with COS v.4.0 and higher.
   */
  isPasscodeSet?: boolean;
  /**
   * Array of ellipctic curves, supported by this card. Only wallets with these curves can be created.
   */
  supportedCurves: [EllipticCurve];
  /**
   * Wallets, created on the card, that can be used for signature
   */
  wallets?: Wallet[];
  /**
   * Card's attestation report
   */
  attestation: Attestation;
  /**
   * Any non-zero value indicates that the card experiences some hardware problems.
   * User should withdraw the value to other blockchain wallet as soon as possible.
   * Non-zero Health tag will also appear in responses of all other commands.
   */
  health?: number;
  /**
   * Remaining number of `SignCommand` operations before the wallet will stop signing transactions.
   * This counter were deprecated for cards with COS 4.0 and higher
   */
  remainingSignatures?: number;
}

export type NFCStatusResponse = {
  enabled: boolean;
  support: boolean;
};

/**
 * Event's listeners
 */
export type Events = 'NFCStateChange';
export type EventCallback = {
  enabled: boolean;
};

/**
 * Wrapper for a message that can be shown to user after a start of NFC session.
 */
export interface Message {
  /**
   * Body of message
   */
  body?: string;
  /**
   * Header of message
   */
  header?: string;
}

export interface ReadIssuerDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
  /**
   * Data defined by user's App.
   */
  userData: Data;
  /**
   * Counter initialized by user's App and increased on every signing of new transaction
   */
  userProtectedData: Data;
  /**
   * Counter initialized by user's App and increased on every signing of new transaction
   */
  userCounter: number;
  /**
   * Counter initialized by user's App (confirmed by PIN2) and increased on every signing of new transaction
   */
  userProtectedCounter: number;
}

export interface WriteIssuerDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface WriteIssuerExtraDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface WriteUserDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface WriteUserProtectedDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface ReadIssuerExtraDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
  /**
   * Size of all Issuer_Extra_Data field.
   */
  size?: number;
  /**
   * Data defined by issuer.
   */
  issuerData?: Data;
}

export interface ReadUserDataResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
  /**
   * Data defined by user's App.
   */
  userData: Data;
  /**
   * Counter initialized by user's App and increased on every signing of new transaction
   */
  userProtectedData: Data;
  /**
   * Counter initialized by user's App and increased on every signing of new transaction
   */
  userCounter: number;
  /**
   * Counter initialized by user's App (confirmed by PIN2) and increased on every signing of new transaction
   */
  userProtectedCounter: number;
}

export interface CreateWalletResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;

  /**
   * Created wallet
   */
  wallet: Wallet;
}

export interface SuccessResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

/**
 * Config of Wallet
 */
export interface WalletConfig {
  isReusable?: boolean;
  prohibitPurgeWallet?: boolean;
  EllipticCurve?: EllipticCurve;
  signingMethods?: SigningMethod;
}

export interface FileSettingsChange {
  fileIndex: number;
  settings: FileSettings;
}

export interface File {
  data: Data;
  startingSignature?: Data;
  finalizingSignature?: Data;
  counter?: number;
  issuerPublicKey?: Data;
  requiredPasscode?: boolean;
  minFirmwareVersion?: FirmwareVersion;
  maxFirmwareVersion?: FirmwareVersion;
}

export type ReadFilesResponse = {
  files: File[];
};

export interface WriteFilesResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
  fileIndex?: number;
}

export interface DeleteFilesResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface ChangeFilesSettingsResponse {
  /**
   * Unique Tangem card ID number.
   */
  cardId: string;
}

export interface TangemSdk {
  scanCard(initialMessage?: Message): Promise<Card>;

  sign(
    hashes: Data[],
    walletPublicKey: Data,
    cardId: string,
    hdPath?: DerivationPath,
    initialMessage?: Message
  ): Promise<[Data]>;

  readIssuerData(
    cardId?: string,
    initialMessage?: Message
  ): Promise<ReadIssuerDataResponse>;

  writeIssuerData(
    issuerData: Data,
    issuerDataSignature: Data,
    issuerDataCounter?: number,
    cardId?: string,
    initialMessage?: Message
  ): Promise<WriteIssuerDataResponse>;

  readIssuerExtraData(
    cardId?: string,
    initialMessage?: Message
  ): Promise<ReadIssuerExtraDataResponse>;

  writeIssuerExtraData(
    issuerData: Data,
    startingSignature: Data,
    finalizingSignature: Data,
    issuerDataCounter?: number,
    cardId?: string,
    initialMessage?: Message
  ): Promise<WriteIssuerExtraDataResponse>;

  readUserData(
    cardId?: string,
    initialMessage?: Message
  ): Promise<ReadUserDataResponse>;

  writeUserData(
    userData: Data,
    userCounter: number,
    cardId?: string,
    initialMessage?: Message
  ): Promise<WriteUserDataResponse>;

  writeUserProtectedData(
    userProtectedData: Data,
    userProtectedCounter: Data,
    cardId?: string,
    initialMessage?: Message
  ): Promise<WriteUserProtectedDataResponse>;

  createWallet(
    curve: EllipticCurve,
    isPermanent: boolean,
    cardId: string,
    initialMessage?: Message
  ): Promise<CreateWalletResponse>;

  purgeWallet(
    walletPublicKey: Data,
    cardId: string,
    initialMessage?: Message
  ): Promise<SuccessResponse>;

  setAccessCode(
    accessCode: String,
    cardId: string,
    initialMessage?: Message
  ): Promise<SuccessResponse>;

  setPasscode(
    passcode: String,
    cardId: string,
    initialMessage?: Message
  ): Promise<SuccessResponse>;

  readFiles(
    readPrivateFiles: boolean,
    indices?: number[],
    cardId?: string,
    initialMessage?: Message
  ): Promise<ReadFilesResponse>;

  writeFiles(
    files: File[],
    cardId?: string,
    initialMessage?: Message
  ): Promise<WriteFilesResponse>;

  deleteFiles(
    indicesToDelete?: number[],
    cardId?: string,
    initialMessage?: Message
  ): Promise<DeleteFilesResponse>;

  changeFilesSettings(
    changes: FileSettingsChange,
    cardId?: String,
    initialMessage?: Message
  ): Promise<ChangeFilesSettingsResponse>;

  startSession(): Promise<void>;

  stopSession(): Promise<void>;

  getNFCStatus(): Promise<NFCStatusResponse>;

  on(eventName: Events, handler: (state: EventCallback) => void): void;

  removeListener(
    eventName: Events,
    handler: (state: EventCallback) => void
  ): void;
}