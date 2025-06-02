interface CheckoutIdProps {
  params: Promise<{
    checkoutId: string;
    slug: string;
  }>;
}

export default async function Success({ params }: CheckoutIdProps) {
  const { checkoutId, slug } = await params;

  return (
    <div>
      <h1>
        Success {checkoutId} {slug}
      </h1>
    </div>
  );
}
