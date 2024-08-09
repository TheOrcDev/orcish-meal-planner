import * as React from "react";

interface BoughtTokensProps {
  tokens: string;
}

export const BoughtTokens: React.FC<Readonly<BoughtTokensProps>> = ({
  tokens,
}) => (
  <div>
    <h1>Congratulations!</h1>

    <p>You successfully bought {tokens} tokens!</p>

    <p>Go and spend them to create your awesome meal plans!</p>
  </div>
);
