import db from "@/db";
import { user } from "@/db/schema";
import { WebhookEvent } from "@clerk/tanstack-start/server";
import { createAPIFileRoute } from "@tanstack/start/api";
import { match } from "ts-pattern";

export const APIRoute = createAPIFileRoute("/api/users/webhook")({
  POST: async ({ request, params }) => {
    // Get body
    const payload = await request.json();
    console.log("Payload:", payload.data.email_addresses[0].email_address);

    await match(payload)
      .with({ type: "user.created" }, () =>
        db.insert(user).values({
          clerkId: payload.data.id,
          email: payload.data.email_addresses[0].email_address,
        })
      )
      .otherwise(() => {
        console.log("Unknown event type:", payload);
      });

    return new Response("Webhook received", { status: 200 });
  },
});
