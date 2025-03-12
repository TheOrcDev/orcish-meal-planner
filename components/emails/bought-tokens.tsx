import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BoughtTokensProps {
  tokens: string;
}

export const BoughtTokens = ({ tokens }: BoughtTokensProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You successfully purchased {tokens} tokens for your meal planner!
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded-md bg-white p-[20px]">
            <Section className="text-center">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/images/email-cover.jpg`}
                alt="Meal Planner Banner"
                width="600"
                className="h-auto w-full rounded-md"
              />
            </Section>

            <Section className="mt-[32px] text-center">
              <Heading className="text-[24px] font-bold text-green-600">
                Congratulations!
              </Heading>

              <Text className="text-[18px] text-gray-800">
                You successfully bought{" "}
                <span className="font-bold">{tokens} tokens</span>!
              </Text>

              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/meal-planner.png`}
                alt="Token Success"
                width="100"
                className="mx-auto my-[20px] h-auto w-[100px]"
              />

              <Text className="text-[16px] text-gray-700">
                Go and spend them to create your awesome meal plans!
              </Text>

              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/meal-planner`}
                className="mx-auto mt-[32px] box-border rounded-md bg-green-600 px-[20px] py-[12px] text-[16px] font-medium text-white"
              >
                Start Creating Meal Plans
              </Button>
            </Section>

            <Section className="mt-[40px] border-t border-gray-200 pt-[20px]">
              <Text className="text-[14px] text-gray-600">
                Here's what you can do with your tokens:
              </Text>

              <Text className="text-[14px] text-gray-600">
                • Create personalized daily meal plans
              </Text>
              <Text className="text-[14px] text-gray-600">
                • Access recipes and nutrition information
              </Text>
              <Text className="text-[14px] text-gray-600">
                • Save your favorite meal combinations
              </Text>
            </Section>

            <Section className="mt-[32px] text-center">
              <Text className="text-[14px] text-gray-500">
                Need help? Contact our support team at{" "}
                <Link
                  href="mailto:support@mealplanner.example.com"
                  className="text-green-600"
                >
                  support@mealplanner.example.com
                </Link>
              </Text>
            </Section>

            <Section className="mt-[32px] text-center">
              <Text className="m-0 text-[12px] text-gray-500">
                © {new Date().getFullYear()} Meal Planner AI. All rights
                reserved.
              </Text>
              <Text className="m-0 text-[12px] text-gray-500">
                <Link
                  href="https://mealplanner.example.com/unsubscribe"
                  className="text-gray-500"
                >
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
