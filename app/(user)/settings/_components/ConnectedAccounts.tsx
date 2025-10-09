"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { Star, Twitter } from "lucide-react";
export function ConnectedAccounts() {
  const connectedAccounts = [
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      connected: true,
      action: "Disconnect",
    },
    {
      id: "google",
      name: "Google",
      icon: Mail,
      connected: false,
      action: "Connect",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      connected: false,
      action: "Connect",
    },
  ];

  const handleAccountAction = (accountId: string) => {
    console.log(`${accountId} action clicked`);
    // Add your connection/disconnection logic here
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <account.icon className="h-5 w-5" />
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.connected ? "Connected" : "Not Connected"}
                  </p>
                </div>
              </div>
              <Button
                variant={account.connected ? "secondary" : "default"}
                onClick={() => handleAccountAction(account.id)}
              >
                {account.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
