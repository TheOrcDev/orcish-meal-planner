import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordProps {
  resetLink: string;
  username: string;
}

const ForgotPasswordEmail = ({ resetLink, username }: ForgotPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Meal Planner password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white border border-solid border-gray-200 rounded-[8px] p-[48px] max-w-[600px]">
            <Heading className="text-[24px] font-bold text-gray-800 m-0 mb-[24px]">
              Reset Your Password
            </Heading>

            <Text className="text-[16px] leading-[24px] text-gray-600 mb-[24px]">
              Hello {username},
            </Text>

            <Text className="text-[16px] leading-[24px] text-gray-600 mb-[24px]">
              We received a request to reset your password for your Meal Planner
              account. Click the button below to create a new password:
            </Text>

            <Section className="text-center mb-[32px]">
              <Button
                className="bg-green-600 text-white font-bold py-[12px] px-[20px] rounded-[4px] no-underline text-center box-border"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-[16px] leading-[24px] text-gray-600 mb-[24px]">
              This password reset link will expire in 24 hours. If you didn't
              request a password reset, you can safely ignore this email.
            </Text>

            <Text className="text-[16px] leading-[24px] text-gray-600 mb-[32px]">
              Need help? Contact our support team at support@mealplanner.com
            </Text>

            <Text className="text-[14px] leading-[20px] text-gray-500 mb-[32px]">
              For security reasons, please never share your password with
              anyone.
            </Text>

            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              <Text className="text-[14px] text-gray-500 m-0">
                © {new Date().getFullYear()} Meal Planner. All rights reserved.
              </Text>
              <Text className="text-[14px] text-gray-500 m-0">
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`}
                  className="text-gray-500 underline"
                >
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
