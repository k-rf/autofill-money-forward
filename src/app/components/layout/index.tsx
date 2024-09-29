interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return <div className="p-4">{children}</div>;
};
