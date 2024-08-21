import dotenv from "dotenv";
dotenv.config();

import express from "express";
import WhatsApp from "whatsapp";
import {
  formLinkMessage,
  thankYouMessage,
  webDevMessage,
  welcomeMessage,
} from "./utils/templates.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
// const wa = new WhatsApp("315040685036083");
const wa = new WhatsApp("401029369753553");

const { WEBHOOK_VERIFICATION_TOKEN, PORT } = process.env;

const keepStep = [];
// { number, step }
const templateWithStep = async (step = 0, message, service) => {
  switch (step) {
    case 1:
      await wa.messages.interactive(
        welcomeMessage(message?.from),
        message?.from
      );
      break;
    case 2:
      await wa.messages.interactive(webDevMessage(), message?.from);
      break;
    case 3:
      await wa.messages.template(
        formLinkMessage(service, message?.from),
        message?.from
      );
      break;
    case 4:
      await wa.messages.text(thankYouMessage(message?.from), message?.from);
    default:
      await wa.messages.interactive(
        welcomeMessage(message?.from),
        message?.from
      );
      break;
  }
};

//TODO: Work on the flow
app.post("/webhook", async (req, res) => {
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  // console.log("Incoming webhook message: ", JSON.stringify(message, null, 2));
  // check if the incoming message contains text
  if (message?.type === "text") {
    const isfound = keepStep.find((d) => d.num === message?.from);
    if (!isfound) {
      await templateWithStep(1, message);
    } else {
      await templateWithStep(isfound.step, message);
    }
    // mark incoming message as read
    await wa.messages.status({
      status: "read",
      message_id: message.id,
    });
  }

  if (message?.type === "interactive") {
    // const isfound = keepStep.find((d) => d.num === message?.from);
    // if (isfound && isfound.step > 2) {
    //   keepStep.map((d) => {
    //     if (d.num === message?.from) {
    //       d.step = d.step + 1;
    //     }
    //   });
    // } else {
    //   keepStep.push({ num: message?.from, step: 1 });
    // }
    const interactiveReply = message?.interactive?.list_reply?.id;
    console.log(interactiveReply);
    switch (interactiveReply) {
      case "webdev":
        await templateWithStep(2, message);
        break;
      case "appdev":
        await templateWithStep(3, message, "App Development");
        break;
      case "digitalmarketing":
        await templateWithStep(3, message, "Digital Marketing");
        break;
      case "graphicdesign":
        await templateWithStep(3, message, "Graphic Design");
        break;
      case "frontend":
        await templateWithStep(3, message, "Frontend Development");
        break;
      case "backend":
        await templateWithStep(3, message, "Backend Development");
        break;
      case "fullstack":
        await templateWithStep(3, message, "Fullstack Development");
        break;
      default:
        await templateWithStep(1, message);
        break;
    }

    await wa.messages.status({
      status: "read",
      message_id: message.id,
    });
  }
  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFICATION_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/form/:phone", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.post("/form/:phone", (req, res) => {
  (async () => {
    const isfound = keepStep.find((d) => d.num === req.params.phone);
    console.log(isfound);
    await templateWithStep(4, { from: req.params.phone });
    // if (isfound) {
    // }
  })();
  res.status(200).json({
    success: true,
    data: req.body,
    message: "Form submitted successfully",
  });
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
