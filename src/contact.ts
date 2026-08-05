import { infrai } from "./infrai.ts";

export type ContactSubmission = {
  playerName: string;
  replyTo: string;
  topic: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function deliverContactForm(submission: ContactSubmission) {
  const inbox = process.env.TEAM_INBOX;
  if (!inbox) throw new Error("Set TEAM_INBOX to the studio inbox address.");

  const ticket = crypto.randomUUID();
  const player = escapeHtml(submission.playerName.trim());
  const replyTo = escapeHtml(submission.replyTo.trim());
  const topic = escapeHtml(submission.topic.trim());
  const message = escapeHtml(submission.message.trim()).replace(/\n/g, "<br>");

  return infrai.email.send({
    to: inbox,
    subject: `[Player contact] ${submission.topic.trim()}`,
    html: `<h1>New player message</h1><p><b>Player:</b> ${player}</p><p><b>Reply to:</b> ${replyTo}</p><p><b>Topic:</b> ${topic}</p><p>${message}</p>`,
  }, ticket);
}
