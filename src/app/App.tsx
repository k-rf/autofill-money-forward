import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useRef, useState } from "react";

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
import { TogglCsvHeader } from "./models/toggl.model";

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

      const csv = e.target.result.split("\n").map((row) =>
        row.split(",").map((col) => {
          // NOTE: 文字列が `"` で囲まれているため、それを取り除いている。
          return /"(?<col>.+)"/.exec(col)?.groups?.["col"] ?? "";
        }),
      );

      if (!atLeast(csv, 1)) {
        console.error("CSV is empty");
        return;
      }

      const [header, ...contents] = csv;
      const { success, error } = TogglCsvHeader.safeParse(header);

      if (!success) {
        console.error(error);
        return;
      }

      setData(
        contents
          .filter((row) => atLeast(row, 13))
          .map((row) => ({
            date: row[7].replaceAll("-", "/"),
            amount: config.feeMap(row[5]),
            memo: row[5],
          })),
      );
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
            <ReloadIcon />
          </Button>
        </div>
        <Table className="text-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">日付</TableHead>
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
