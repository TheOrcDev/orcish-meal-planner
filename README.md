# Orcish Meal Planner

![orcish-meal-planner](https://github.com/user-attachments/assets/9c1cdd6d-9e46-4380-8ec6-b36b69934bf8)

## Overview

The Orcish Meal Planner is an easy-to-use app that helps you create daily meal plans based on the user data.

## Getting Started

### Installation

To begin, install the required dependencies using the following command:

```bash
pnpm i
```

# Development Server

After installing the dependencies, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

`cp .env.example .env`

### Configuration

Create a copy of the provided `.env.example` file and name it `.env`. Fill in the required OpenAI API Key in the newly created `.env` file, and Clerk variables if you're going to use authentication:

```bash
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Make sure to replace placeholder values with your actual API keys, and keep them safe!

## Usage Guide

- Login to the app
- Enter your data in the form
- Use your daily meal plan!
