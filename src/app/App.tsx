import { TrashIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { match } from "ts-pattern";

import { atLeast } from "~/lib/at-least";

import { Layout } from "./components/layout";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { PayPay } from "./models/paypay.model";
import { TogglV2 } from "./models/toggl-v2.model";
import { Toggl } from "./models/toggl.model";

interface Props {
  config: {
    feeMap: (value: string) => number;
  };
}

export const App = ({ config }: Props) => {
  const reader = useMemo(() => new FileReader(), []);

  const [tab, setTab] = useState<chrome.tabs.Tab>();
  const [data, setData] = useState<{ date: string; amount: number; memo: string }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (tab?.id) chrome.tabs.sendMessage(tab.id, data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.currentTarget.files ?? [])];

    if (atLeast(files, 1)) reader.readAsText(files[0], "utf-8");
  };

  const handleReset = () => {
    setData([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
      if (tab?.id === undefined) return;

      setTab(tab);
    });
  }, []);

  useEffect(() => {
    const listener = (e: FileReaderEventMap["load"]) => {
      if (typeof e.target?.result !== "string") return;

      const csv = e.target.result
        .trim()
        .replaceAll(/(\r\n|\n|\r)/g, "\n")
        .split("\n")
        .map((row) =>
          row.split(",").map((col) => {
            // NOTE: 文字列が `"` で囲まれているため、それを取り除いている。
            return /"(?<col>.+)"/.exec(col)?.groups?.["col"] ?? col;
          }),
        );

      if (!atLeast(csv, 1)) {
        console.error("CSV is empty");
        return;
      }

      const [header, ...contents] = csv;
      const data = match(header)
        .when(
          (h) => Toggl.safeParse(h).success,
          () => {
            return (contents as Toggl[]).map((row) => ({
              date: row[7].replaceAll("-", "/"),
              amount: config.feeMap(row[5]),
              memo: row[5],
            }));
          },
        )
        .when(
          (h) => TogglV2.safeParse(h).success,
          () => {
            return (contents as TogglV2[]).map((row) => ({
              date: row[6].replaceAll("-", "/"),
              amount: config.feeMap(row[0]),
              memo: row[0],
            }));
          },
        )
        .when(
          (h) => PayPay.safeParse(h).success,
          () => {
            return (contents as PayPay[])
              .filter((row) => (row[1] as string) !== "-")
              .map((row) => {
                return {
                  date: row[0].split(" ").at(0) ?? "1970/01/01",
                  amount: Number(row[1]),
                  memo: row[8],
                };
              });
          },
        )
        .otherwise(() => {});

      if (!data) {
        console.error("CSVのスキーマが正しくありません。");
        return;
      }

      setData(data);
    };

    reader.addEventListener("load", listener);

    return () => {
      reader.removeEventListener("load", listener);
    };
  });

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="text-sm">Detail Report の CSV を入力します。</div>
        <Input type="file" accept=".csv" onChange={handleInputChange} ref={inputRef} />
        <div className="flex gap-2">
          <Button className="flex-grow" disabled={data.length === 0} onClick={() => handleClick()}>
            Autofill
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <TrashIcon size={20} />
          </Button>
        </div>
        <Table className="text-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={`${row.date}-${i}`}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.memo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};
