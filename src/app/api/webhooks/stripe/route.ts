/**
 * Stripe Webhook Handler
 *
 * Receives Stripe webhook events and triggers workflow executions.
 * Filters events based on user-configured event type to prevent unwanted triggers.
 *
 * @see {@link https://stripe.com/docs/webhooks} Stripe Webhooks Documentation
 */

import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    const eventType = url.searchParams.get("eventType");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 }
      );
    }

    if (!eventType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: eventType",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Only trigger workflow for the configured event type
    if (body.type !== eventType) {
      console.log(
        `Ignoring Stripe event: ${body.type} (configured for ${eventType})`
      );
      return NextResponse.json({
        success: true,
        message: `Event ${body.type} acknowledged but not processed`,
      });
    }

    const stripeData = {
      // Event metadata
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    // Trigger Inngest Job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json({ success: true, status: 200 });
  } catch (error) {
    console.error("Error in Stripe workflow route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe webhook." },
      { status: 500 }
    );
  }
}
