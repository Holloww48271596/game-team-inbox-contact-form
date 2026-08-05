import { deliverContactForm } from "../src/contact.ts";

const result = await deliverContactForm({
  playerName: "Rin",
  replyTo: "rin@example.com",
  topic: "Controller mapping",
  message: "The jump action is missing after I remap my controls.",
});

console.log("Delivered player contact message:", result.message_id);
