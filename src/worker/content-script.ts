import { retry } from "~/lib/retry";

interface Payload {
  date: string;
  amount: number;
  memo: string;
}

const inputElement = async (
  id: string,
  args: { variant: "input"; value: string } | { variant: "click" },
) => {
  const el = document.querySelector<HTMLInputElement>(id);

  if (!el) return;

  if (args.variant === "input") el.value = args.value;
  else {
    await retry(() => {
      if (el.style.display === "none") return undefined;
      return true;
    }, 5);
    el.click();
  }
};

const anchorElement = (id: string) => {
  document.querySelector<HTMLAnchorElement>(id)?.click();
};

const flow = async ({ date, amount, memo }: Payload) => {
  await inputElement("#updated-at", { variant: "input", value: date });
  await inputElement("#appendedPrependedInput", { variant: "input", value: `${amount}` });
  anchorElement("#js-large-category-selected");
  anchorElement("#\\31 937294");
  await inputElement("#js-content-field", { variant: "input", value: memo });
  await inputElement("#submit-button", { variant: "click" });
};

const next = async () => {
  await inputElement("#confirmation-button", { variant: "click" });
};

const end = async () => {
  await inputElement("#cancel-button", { variant: "click" });
};

chrome.runtime.onMessage.addListener((payload: Payload[]) => {
  const chain = () =>
    payload.reduce(async (acc, args, index, arr) => {
      await acc;
      await flow(args);

      if (index !== arr.length - 1) return next();
      return end();
    }, Promise.resolve());

  void chain();

  return true;
});
