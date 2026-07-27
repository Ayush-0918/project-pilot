import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Prevent static generation / build-time collection

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') ?? '';

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ?? ''
      );
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        if (!userId) break;

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            planTier: 'premium',
            status: 'active',
            currentPeriodStart: new Date(),
          },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            planTier: 'premium',
            status: 'active',
            currentPeriodStart: new Date(),
          },
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!sub) break;

        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            status: subscription.status === 'active' ? 'active' : 'inactive',
            currentPeriodStart: subscription.current_period_start
              ? new Date(subscription.current_period_start * 1000)
              : undefined,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : undefined,
          },
        });
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subId = invoice.subscription as string;
        if (!subId) break;

        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subId },
        });
        if (!sub) break;

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'active' },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
