import * as React from "react";
import { Tailwind, pixelBasedPreset, Button } from "@react-email/components";
interface EmailTemplateProps {
  firstName: string;
}
export default function Email({ firstName }: EmailTemplateProps) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <h1>Welcome, {firstName}!</h1>

      <Button
        href="https://example.com"
        className="bg-brand px-3 py-2 font-medium leading-4 text-white"
      >
        Click me
      </Button>
    </Tailwind>
  );
}
