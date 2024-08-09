import * as React from "react";

interface WelcomeProps {
  email: string;
}

export const Welcome: React.FC<Readonly<WelcomeProps>> = ({ email }) => (
  <div>
    <h1>Welcome, {email}!</h1>
  </div>
);
