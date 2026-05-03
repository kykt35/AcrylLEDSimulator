import React from "react";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <SimulatorScreen searchParams={resolvedSearchParams} />;
}
