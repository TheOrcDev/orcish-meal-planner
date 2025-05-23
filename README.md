# Orcish Meal Planner

![meal-planner](https://github.com/user-attachments/assets/080fca21-92fa-42a8-8e8d-0cfb6feb5863)

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
# App
APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key

# Database
DATABASE_URL=your_database_url

# Email
RESEND_API_KEY=your_re_send_api_key
EMAIL_SENDER_NAME=your_email_sender_name
EMAIL_SENDER_ADDRESS=your_email_sender_address
```

Make sure to replace placeholder values with your actual API keys, and keep them safe!

## Usage Guide

- Login to the app
- Enter your data in the form
- Use your daily meal plan!
