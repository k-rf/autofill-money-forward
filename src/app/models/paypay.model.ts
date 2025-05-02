import { z } from "zod";

export const PayPay = z.tuple([
  z.literal("取引日"),
  z.literal("出金金額（円）"),
  z.literal("入金金額（円）"),
  z.literal("海外出金金額"),
  z.literal("通貨"),
  z.literal("変換レート（円）"),
  z.literal("利用国"),
  z.literal("取引内容"),
  z.literal("取引先"),
  z.literal("取引方法"),
  z.literal("支払い区分"),
  z.literal("利用者"),
  z.literal("取引番号"),
]);
export type PayPay = z.infer<typeof PayPay>;
