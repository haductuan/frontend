import { createAccount, walletButton } from "./elements";
export interface useCasesType {
  steps: Array<any>;
}
export const createWallet: useCasesType = {
  steps: [
    {
      selector: walletButton,
      content: "Open ziden wallet",
    },
    {
      selector: createAccount.createAccountButton,
      content: "Select create account",
    },
    {
      selector: createAccount.passwordInput,
      content: "Enter password and confirm password",
    },
    {
      selector: createAccount.termOfUseCheckBox,
      content: "Check to agree to the term of use",
    },
    {
      selector: createAccount.confirmButton,
      content: "Press confirm",
    },
    {
      selector: createAccount.mnemonicDisplay,
      content: "This is the mnemonic you need to save",
    },
    {
      selector: createAccount.confirmButton,
      content: "Press confirm",
    },
    {
      selector: createAccount.mnemonicInputs,
      content: "Enter the previous displayed mnemonic in correct order",
    },
    {
      selector: createAccount.confirmButton,
      content: "Press confirm",
    },
    {
      selector: createAccount.closeButton,
      content: "Done!, your wallet has been created",
    },
    {
      selector: createAccount.resultWallet,
      content: "This is your wallet UI",
    },
  ],
};
