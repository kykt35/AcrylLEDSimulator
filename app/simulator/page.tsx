import React from "react";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";

type SimulatorPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SimulatorPage({ searchParams }: SimulatorPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <SimulatorScreen searchParams={resolvedSearchParams} />;
}
