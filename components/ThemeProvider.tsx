type Props = { children: React.ReactNode };

/** Site sempre em dark — classe em `<html className="dark">` no layout raiz (sem script do next-themes). */
export function ThemeProvider({ children }: Props) {
  return children;
}
