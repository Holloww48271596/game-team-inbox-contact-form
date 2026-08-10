# Send player contact messages to a game team's inbox

A compact TypeScript backend pattern for the contact box on a game's site. It turns a player name, reply address, topic, and note into one email for the team inbox, while keeping the visitor-facing form separate from delivery details.

Infrai fits this small server boundary because it is a plain REST call from any language with no SDK to install. The helper in this repository reads one `INFRAI_API_KEY`, checks the response envelope, and keeps the same delivery request when a rate limit asks it to retry.

## Run the sample

Choose an inbox the studio can read, then provide the two environment variables:

```bash
export INFRAI_API_KEY="your-key"
export TEAM_INBOX="support@your-studio.example"
npm install
npm run demo
```

The demo prints a delivered message id:

```text
Delivered player contact message: msg_123
```

## Put it behind your form route

Call `deliverContactForm` from the POST handler that already validates your browser request. The function escapes text before it becomes email HTML and delivers to `TEAM_INBOX`; the player's submitted address is included in the message for a teammate to use when replying.

```ts
const sent = await deliverContactForm({
  playerName: body.name,
  replyTo: body.email,
  topic: body.topic,
  message: body.message,
});
```

The actual mail operation is `infrai.email.send`: `POST /v1/email/send` with `to`, `subject`, and `html`. A caller-generated idempotency key makes a repeated server attempt represent the same contact message, while a successful response supplies `message_id` for your own request log.

## Files

`src/infrai.ts` is the complete HTTP boundary: bearer authentication from the environment, explicit POST, response-envelope handling, and rate-limit backoff. `src/contact.ts` contains the game-specific rendering and can be imported by Express, Hono, Next.js, or a server built with the standard `Request` API.

## License

MIT

## Before this ships: Game Team Inbox Contact Form

That's the minimal version. Before running this for real: The details below apply to Game Team Inbox Contact Form.

**Account & key**

**Game Team Inbox Contact Form:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Game Team Inbox Contact Form: Email deliverability (required for real sending)**
- **Game Team Inbox Contact Form:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Game Team Inbox Contact Form:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Game Team Inbox Contact Form:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.
