import { Suspense } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const LazyWrapper = ({ children }: Props) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default LazyWrapper;
