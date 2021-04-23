import { Request, Response, Router } from "express";
import { v4 as uuid } from "uuid";

const fetch = require("node-fetch");
const GhostContentAPI = require("@tryghost/content-api");

const messages = [];

const api = new GhostContentAPI({
  url: "https://api.poshdevelopment.com/ghost-cms",
  key: "ba6ee05c8e1f402ba15d278aa9",
  version: "v3",
});

// const possibleResponses = [
//   {message: 'Hello', type: 'bot', date: new Date()},
//   {message: 'How are you?', type: 'bot', date: new Date()},
//   {message: 'How can I help you?', type: 'bot', date: new Date()},
//   {message: 'Sorry I am a pretty basic chatbot', date: new Date()},
//   {message: 'Have a good day', date: new Date()},
// ];

const possibleResponses = [
  "Hello",
  "How are you?",
  "How can I help you?",
  "Sorry I am a pretty basic chatbot",
  "Have a good day",
];

class MessageController {
  router: any;

  constructor() {
    this.router = Router();

    this.router.get("/", this.get);
    this.router.post("/send", this.send);
    this.router.post("/commands/anime", this.anime);
    this.router.post("/commands/articles", this.articles);
    this.router.post("/commands/drink", this.drink);
  }

  get = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ messages });
  };

  send = async (req: Request, res: Response): Promise<void> => {
    const message = req.body;

    if (!message.message) {
      res.status(400).json({ error: "Body must include 'message'" });
    } else {
      const response =
        possibleResponses[
          ((messages.length - (messages.length % 2)) / 2) %
            possibleResponses.length
        ];
      const botResponse = {
        id: uuid(),
        command: "message",
        message: response,
        type: "bot",
        date: new Date(),
      };

      messages.push(message);
      messages.push(botResponse);

      res.status(200).json({ botResponse });
    }
  };

  anime = async (req: Request, res: Response): Promise<void> => {
    const message = req.body;
    fetch("https://animechan.vercel.app/api/random")
      .then((res) => res.json())
      .then((quote) => {
        const botResponse = {
          id: uuid(),
          command: "anime",
          message: quote,
          type: "bot",
          date: new Date(),
        };

        messages.push(message);
        messages.push(botResponse);
        res.status(200).json({ botResponse });
      });
  };

  drink = async (req: Request, res: Response): Promise<void> => {
    const message = req.body;
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((drink) => {
        const botResponse = {
          id: uuid(),
          command: "drink",
          message: { ingredients: [] },
          type: "bot",
          date: new Date(),
        };
        for (const prop in drink["drinks"][0]) {
          if (prop === "strDrink") {
            botResponse["message"]["drink"] = drink["drinks"][0][prop];
          } else if (prop === "strDrinkThumb") {
            botResponse["message"]["image"] = drink["drinks"][0][prop];
          } else if (
            prop.includes("strIngredient") &&
            drink["drinks"][0][prop]
          ) {
            botResponse["message"]["ingredients"].push(
              drink["drinks"][0][prop]
            );
          }
        }

        messages.push(message);
        messages.push(botResponse);
        res.status(200).json({ botResponse });
      });
  };

  articles = async (req: Request, res: Response): Promise<void> => {
    const message = req.body;
    messages.push(message);

    api.posts.browse().then((posts) => {
      let botResponse = {
        id: uuid(),
        command: "articles",
        message: posts.map((item) => ({
          title: item["title"],
          excerpt: item["excerpt"],
        })),
        type: "bot",
        date: new Date(),
      };
      messages.push(botResponse);
      res.status(200).json({ botResponse });
    });
  };
}

export default MessageController;
