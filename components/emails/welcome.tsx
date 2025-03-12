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

export const WelcomeEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to your personalized meal planning journey!</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded-md bg-white p-[20px]">
            <Section className="text-center">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/meal-planner.png`}
                alt="Meal Planner Welcome Banner"
                width="600"
                className="h-auto w-full rounded-md"
              />
            </Section>

            <Section className="mt-[32px]">
              <Heading className="text-center text-[24px] font-bold text-green-600">
                Welcome to Your Meal Planning Journey!
              </Heading>

              <Text className="text-[16px] text-gray-700">Hi there,</Text>

              <Text className="text-[16px] text-gray-700">
                We're thrilled to have you join our community of meal planners!
                With our app, you can create personalized daily meal plans that
                fit your lifestyle, dietary preferences, and nutritional goals.
              </Text>

              <Heading className="mt-[24px] text-[18px] font-bold text-gray-800">
                Here's how to get started:
              </Heading>

              <Text className="text-[16px] text-gray-700">
                1. <span className="font-bold">Set up your profile</span> - Add
                your dietary preferences, allergies, and health goals
              </Text>
              <Text className="text-[16px] text-gray-700">
                2. <span className="font-bold">Purchase tokens</span> - Each
                token allows you to generate a custom meal plan
              </Text>
              <Text className="text-[16px] text-gray-700">
                3. <span className="font-bold">Create your first plan</span> -
                Select your preferences and let our AI do the rest
              </Text>

              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/meal-planner`}
                className="mx-auto mt-[32px] box-border block rounded-md bg-green-600 px-[20px] py-[12px] text-center text-[16px] font-medium text-white"
              >
                Create Your First Meal Plan
              </Button>
            </Section>

            {/* <Section className="mt-[32px] text-center">
              <Text className="text-[16px] text-gray-700">
                We're here to support you on your meal planning journey. If you
                have any questions, our support team is just a click away.
              </Text>

              <Button
                href="https://mealplanner.example.com/support"
                className="mx-auto mt-[16px] box-border rounded-md bg-gray-200 px-[20px] py-[12px] text-[16px] font-medium text-gray-800"
              >
                Contact Support
              </Button>
            </Section> */}

            {/* <Section className="mt-[40px] border-t border-gray-200 pt-[20px] text-center">
              <Text className="text-[14px] text-gray-500">
                Follow us for tips and inspiration:
              </Text>

              <Section className="mt-[16px] text-center">
                <Link
                  href="https://instagram.com"
                  className="mx-[8px] text-gray-500"
                >
                  Instagram
                </Link>
                <Link
                  href="https://facebook.com"
                  className="mx-[8px] text-gray-500"
                >
                  Facebook
                </Link>
                <Link
                  href="https://twitter.com"
                  className="mx-[8px] text-gray-500"
                >
                  Twitter
                </Link>
                <Link
                  href="https://pinterest.com"
                  className="mx-[8px] text-gray-500"
                >
                  Pinterest
                </Link>
              </Section>
            </Section> */}

            <Section className="mt-[32px] text-center">
              <Text className="m-0 text-[12px] text-gray-500">
                © {new Date().getFullYear()} Meal Planner AI. All rights
                reserved.
              </Text>
              <Text className="m-0 text-[12px] text-gray-500">
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`}
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
