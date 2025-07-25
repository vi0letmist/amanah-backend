import { Suspense } from "react";
import DataUser from "./DataUser";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataUser />
    </Suspense>
  );
}
