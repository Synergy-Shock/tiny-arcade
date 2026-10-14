// DocuBot help chat relay. Holds DOCUBOT_API_TOKEN on the server; the browser
// widget only ever talks to this route. POST relays messages, GET polls research.
// Reference: https://www.docubot.wiki/docs/api.md (Part A)
export { POST, GET } from "@synergy-shock/docubot-widget/server";
